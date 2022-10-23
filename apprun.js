import axios from 'axios';
import { spawn } from 'child_process';
import { statSync, mkdirSync, createWriteStream } from 'fs';
import { chdir, exit } from 'process';
import { clearInterval } from 'timers';
import inquirer from 'inquirer';
import fs from 'fs';
var conda = null;
// var miniconda_path = "D:/Miniconda3";
var miniconda_path = 'C:/Users/admin/miniconda3';
function conda_send(sts, callback) {
	conda.stdin.write(sts + ' \n');
	if (callback) callback();
}
function activate_conda(callback) {
	console.log('cmd', [
		'/K',
		miniconda_path + '/Scripts/activate.bat',
		miniconda_path,
	]);
	conda = spawn(
		'cmd',
		['/K', miniconda_path + '/Scripts/activate.bat', miniconda_path],
		{
			stdio: 'pipe',
		}
	);
	conda.stdout.on('data', (data) => {
		var content = data.toString();
		console.log(content);
	});
	conda.stderr.on('data', (data) => {
		var content = data.toString();
		console.log(content);
	});

	conda_send('conda activate genshin-vitsweb');
	conda_send('node app.js');

	// callback()
}
activate_conda();
