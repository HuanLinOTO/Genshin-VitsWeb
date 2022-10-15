import request from 'request';
import path from 'path';
import https from 'https';

import fs from 'fs';

const SINGLE = 1024 * 1000;
const SOURCE =
	'https://obs.baimianxiao.cn/share/obs/sankagenkeshi/G_809000.pth';

request(
	{
		method: 'HEAD',
		uri: SOURCE,
		rejectUnauthorized: false,
	},
	(err, res) => {
		if (err) return console.error(err);
		const file = './tmp/t.pth';
		try {
			fs.closeSync(fs.openSync(file, 'w'));
		} catch (err) {
			return console.error(err);
		}
		const size = Number(res.headers['content-length']);
		const length = parseInt(size / SINGLE);
		for (let i = 0; i < length; i++) {
			let start = i * SINGLE;
			let end = i == length ? (i + 1) * SINGLE - 1 : size - 1;
			request({
				method: 'GET',
				uri: SOURCE,
				headers: {
					range: `bytes=${start}-${end}`,
				},
				rejectUnauthorized: false,
			})
				.on('response', (resp) => {
					const range = resp.headers['content-range'];
					// const match = /bytes ([0-9]*)-([0-9]*)/.exec(range);
					// console.log(range);
					// start = match[1];
					// end = match[2];
					console.log(start, end);
				})
				.pipe(fs.createWriteStream(file, { start, end }));
		}
	}
);
