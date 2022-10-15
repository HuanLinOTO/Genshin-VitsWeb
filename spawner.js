import inquirer from 'inquirer';

//inquirer.prompt(questions) -> promise
// console.log(new RegExp('^[A-z]:\\\\(.+?\\\\)*$').test('D:Miniconda3/'));
inquirer
	.prompt([
		{
			type: 'input',
			name: 'miniconda_path',
			message: '请输入你想要把miniconda安装到哪个目录(不知道直接回车)',
			default: 'D:\\Miniconda3\\',
			validate(value, proAnswer) {
				// console.log(value, proAnswer);
				if (!new RegExp('^[A-z]:\\\\(.+?\\\\)*$').test(value)) {
					return '请输入一个路径';
				}
				if (value.indexOf('/') != -1) {
					return '输入的路径不能包含斜杠 请用反斜杠代替';
				}
				return true;
			},
		},
	])
	.then((answers) => {
		console.log(answers);
	});
