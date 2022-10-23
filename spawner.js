import { spawn } from 'child_process';
var aa = spawn('./tmp/miniconda.exe', ['/S', '/D=D:\\tmp\\Miniconda3\\'], {
	silent: true,
});
aa.stdout.on('data', (data) => {
	console.log(data.toString());
	// console.log('[7zip] 解压完毕');
	// callback();
});
aa.stderr.on('data', (data) => {
	console.log(data.toString());
	// console.log('[7zip] 解压完毕');
	// callback();
});
aa.on('exit', () => {});
