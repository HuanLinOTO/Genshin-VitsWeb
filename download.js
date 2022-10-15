import axios from 'axios';
import https from 'https';
import fs from 'fs';
import md5 from './md5.js';
// 分块大小
const chunkSize = 16 * 1024 ** 2; // 16MB

// 拦截请求 不认证SSL 设置Google Chrome UA
axios.interceptors.request.use(function (config) {
	config.headers['User-Agent'] =
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.42';
	config.httpsAgent = new https.Agent({
		// 忽略 SSL 的属性
		rejectUnauthorized: false,
	});
	return config;
});
var downloadEvent = {
	url: '',
	md5: '',
	task_cnt: null,
	/**
	 * 加载区块
	 * @arg {string} url - 下载链接
	 * @arg {Function} callback - 回调函数,第一个参数为区块信息
	 */
	loadChunk(url, callback) {
		this.url = url;
		this.md5 = md5(url);
		console.log(this.md5);
		axios({
			method: 'head',
			url,
		})
			.then((response) => {
				let size = response.headers['content-length'];
				let full_chunk_cnt = parseInt(size / chunkSize);
				let chunk_list = [];

				for (var i = 0; i < full_chunk_cnt; i++) {
					chunk_list.push(
						`${i * chunkSize}-${(i + 1) * chunkSize - 1}`
					);
				}

				// 文件大小不是刚好分完区块
				if (size % chunkSize != 0) {
					chunk_list.push(`${full_chunk_cnt * chunkSize}-`);
				}
				// console.log(chunk_list);
				// console.log(size);
				this.task_cnt = full_chunk_cnt;
				for (let index in chunk_list) {
					let chunk = chunk_list[index];
					// console.log(chunk);
					this.downloadChunk(chunk, index);
				}
				var si = setInterval(() => {
					if (this.task_cnt <= 1) {
						console.log('完成');
						clearInterval(si);
					}
				}, 200);
			})
			.catch(function (error) {
				console.log(error);
			});
	},
	downloadChunk(chunk, index) {
		// console.log(chunk, index);
		axios({
			method: 'get',
			url: this.url,
			headers: {
				Range: 'bytes=' + chunk,
			},
			responseType: 'stream',
		}).then((response) => {
			let wstream = fs.createWriteStream(
				`./tmp/tmp/${this.md5}.${index}.chunk`
			);
			wstream.on('finish', () => {
				// console.log('写入已完成..');
				this.task_cnt--;
			});

			response.data.pipe(wstream);
		});
	},
	mergeChunk() {},
};

downloadEvent.loadChunk(
	'https://obs.baimianxiao.cn/share/obs/sankagenkeshi/G_809000.pth'
);
// downloadChunk();
