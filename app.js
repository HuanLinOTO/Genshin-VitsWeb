import express from 'express';
// import { static } from 'express';
import axios from 'axios';
import { spawn } from 'child_process';
import { statSync, mkdirSync } from 'fs';
var app = express();
globalThis.app = app;
import process from 'process';
import { readFileSync } from 'fs';
import { chdir } from 'process';
import md5 from './md5.js';
import ffmpeg from 'ffmpeg';
import open from 'open';
// process.chdir("../")
try {
	statSync('./dist');
} catch (e) {
	mkdirSync('dist');
}
// 允许跨域
app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
	);
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.header('X-Powered-By', ' 3.2.1');
	if (req.method == 'OPTIONS') res.send(200);
	else next();
});

const npcList = [
	'派蒙',
	'凯亚',
	'安柏',
	'丽莎',
	'琴',
	'香菱',
	'枫原万叶',
	'迪卢克',
	'温迪',
	'可莉',
	'早柚',
	'托马',
	'芭芭拉',
	'优菈',
	'云堇',
	'钟离',
	'魈',
	'凝光',
	'雷电将军',
	'北斗',
	'甘雨',
	'七七',
	'刻晴',
	'神里绫华',
	'戴因斯雷布',
	'雷泽',
	'神里绫人',
	'罗莎莉亚',
	'阿贝多',
	'八重神子',
	'宵宫',
	'荒泷一斗',
	'九条裟罗',
	'夜兰',
	'珊瑚宫心海',
	'五郎',
	'散兵',
	'女士',
	'达达利亚',
	'莫娜',
	'班尼特',
	'申鹤',
	'行秋',
	'烟绯',
	'久岐忍',
	'辛焱',
	'砂糖',
	'胡桃',
	'重云',
	'菲谢尔',
	'诺艾尔',
	'迪奥娜',
	'鹿野院平藏',
];
app.use('/res', express.static('res'));
app.use('/assets', express.static('res'));

var vits_process = spawn('python', ['./vits/genter.py', '8882'], {
	silent: true,
});
vits_process.stdout.setEncoding('utf8');
vits_process.stdout.on('data', function (data) {
	console.log('[genter:INFO]', data.toString());
});

var isloaded = false;

vits_process.stderr.on('data', function (data) {
	console.log('[genter:ERR]', data.toString());
	if (data.toString().indexOf('successfully')) {
		isloaded = true;
	}
});
vits_process.on('exit', () => {
	console.log('[genter] 进程退出');
});

app.use((req, res, next) => {
	if (!isloaded) {
		res.send(
			'请稍等,GentCore正在加载<script>setTimeout(()=>{location.reload()},300)</script>'
		);
		return;
	}
	next();
});

app.use('/', express.static('page'));
var task_cnt = 0;

app.get('/api', function (req, res) {
	// res.send('Hello World');
	// chdir("./vits")
	const get = req.query;
	if (get.speaker == undefined || get.text == undefined) {
		res.sendStatus(400);
		return;
	}
	if (npcList.indexOf(get.speaker) == -1) {
		res.sendStatus(400);
		return;
	}
	const requestMD5 = md5(JSON.stringify(get));
	var speaker = get.speaker;
	var text = get.text;
	var noise = get.noise || 0.667;
	var noisew = get.noisew || 0.8;
	var length = get.length || 1.2;
	try {
		statSync(`./dist/${requestMD5}.wav`);
		res.setHeader('Content-Type', 'audio/wav');
		res.send(readFileSync(`./dist/${requestMD5}.wav`));
		// fs.readFile(`./dist/${requestMD5}.wav`,(data)=>{
		//     res.send(data);
		// })
	} catch (eva114514) {
		//反正不用
		console.log('新增任务', requestMD5);
		task_cnt++;
		console.log(
			`http://localhost:8882/?speaker=${speaker}&text=${text}&noise=${noise}&noisew=${noisew}&length=${length}&requestMD5=${requestMD5}`
		);
		axios
			.get(
				encodeURI(
					`http://localhost:8882/?speaker=${speaker}&text=${text}&noise=${noise}&noisew=${noisew}&length=${length}&requestMD5=${requestMD5}`
				)
			)
			.then(function (response) {
				// 处理成功情况
				// console.log(response);
				res.setHeader('Content-Type', 'audio/wav');
				console.log(`./dist/${requestMD5}.wav`);
				res.send(readFileSync(`./dist/${requestMD5}.wav`));
				// setTimeout(() => {
				// fs.read(`./dist/${requestMD5}.wav`
				//     res.send(data);
				// })
			});
	}
});

app.get('/ttsapi', function (req, res) {
	// res.send('Hello World');
	// chdir("./vits")
	const get = req.query;
	if (get.speaker == undefined || get.text == undefined) {
		res.sendStatus(400);
		return;
	}
	if (npcList.indexOf(get.speaker) == -1) {
		res.sendStatus(400);
		return;
	}
	const requestMD5 = md5(JSON.stringify(get));
	var speaker = get.speaker;
	var text = get.text;
	var noise = get.noise || 0.667;
	var noisew = get.noisew || 0.8;
	var length = get.length || 1.2;
	try {
		statSync(`./dist/${requestMD5}.wav`);
		res.setHeader('Content-Type', 'audio/wav');
		res.send(readFileSync(`./dist/${requestMD5}.mp3`));
		// fs.readFile(`./dist/${requestMD5}.wav`,(data)=>{
		//     res.send(data);
		// })
	} catch (eva114514) {
		//反正不用
		console.log('新增任务', requestMD5);
		task_cnt++;
		console.log(
			`http://localhost:8882/?speaker=${speaker}&text=${text}&noise=${noise}&noisew=${noisew}&length=${length}&requestMD5=${requestMD5}`
		);
		axios
			.get(
				encodeURI(
					`http://localhost:8882/?speaker=${speaker}&text=${text}&noise=${noise}&noisew=${noisew}&length=${length}&requestMD5=${requestMD5}`
				)
			)
			.then(function (response) {
				// 处理成功情况
				// console.log(response);
				res.setHeader('Content-Type', 'audio/mp3');
				console.log(`./dist/${requestMD5}.wav`);
				const process = new ffmpeg(`./dist/${requestMD5}.wav`);
				process.then(
					function (video) {
						console.log(video);
						video.fnExtractSoundToMP3(
							`./dist/${requestMD5}.mp3`,
							function (error, file) {
								if (!error)
									res.send(
										readFileSync(`./dist/${requestMD5}.mp3`)
									);
							}
						);
					},
					function (err) {
						console.log('Error: ' + err);
					}
				);
			});
	}
});

var server = app.listen(8881, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('应用实例，访问地址为 http://127.0.0.1:8881');
	open('http://127.0.0.1:8881/');
});
