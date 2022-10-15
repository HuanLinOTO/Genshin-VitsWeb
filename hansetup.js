import axios from "axios";
import { spawn as 生成子进程 } from "child_process";
import { statSync as 同步查看属性, mkdirSync as 同步创建目录, createWriteStream as 创建写入流 } from "fs";
import { query as 列出快捷方式属性 } from 'windows-shortcuts';  
import { chdir as 改变目录, exit } from "process";
import { clearInterval as 清除计时器 } from "timers";
import inquirer from 'inquirer'
import fs from 'fs'
var miniconda_path;
var activater;
var conda = null;
var ispiploaded = false;
var istorchloaded = false;
var ismonotonic_alignloaded = false;

var 输出 = console.log
var 请求 = axios;
var 调试模式 = process.argv[2] == "-dev";

// 调试模式 = true;

const 下载 = (url,name,回调函数)=>{
    if(调试模式) {
        回调函数();
        return;
    }
    请求({
        method: 'get',
        url: url,
        responseType: 'stream'
    })
    .then(function (response) {
        try {
            同步查看属性("./tmp")
        } catch(e) {
            同步创建目录("./tmp")
        }
        const writer = 创建写入流('./tmp/'+name);
        response.data.pipe(writer)
        writer.on('close', () => {
            回调函数()
        })
        // 回调函数()
    });
}

const unzip = (path,outpath,回调函数)=>{
    if(调试模式) {
        回调函数();
        return;
    }
    var unzip_process = 生成子进程('./7z.exe',["x","./tmp/"+path,"-o"+outpath], {
        silent: true
    });
    unzip_process.on("exit",()=>{
        输出("[7zip] 解压完毕");
        回调函数()
    })
}

const 克隆Git = (url,options,回调函数) => {
    if(调试模式) {
        回调函数();
        return;
    }
    var Git子进程 = 生成子进程('./git/bin/git.exe',["clone",...options,url], {
        silent: true
    });
    Git子进程.on("exit",()=>{
        输出("[git] 仓库克隆完毕");
        回调函数()
    })
}

const pipinstall = (name,回调函数) => {
    if(调试模式) {
        回调函数();
        conda_send("pip install "+name+" -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com")
        return;
    }
    conda_send("pip install "+name+" -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com")
}

function git_install(回调函数) {
    if(调试模式) {
        回调函数();
        return;
    }
    输出("正在下载 Git");
    下载(
        "https://ghproxy.com/github.com/git-for-windows/git/releases/download/v2.38.0.windows.1/PortableGit-2.38.0-64-bit.7z.exe",
        "git.7z.exe",
        () => {
            输出("完成");
            输出("开始解压");
            unzip(
                "git.7z.exe","git",
                回调函数
            )
        }
    )
}

function vits_install(回调函数) {
    // if(调试模式) {
    //     回调函数();
    //     return;
    // }
    输出("开始克隆Vits仓库");
    克隆Git(
        "http://ghproxy.com/https://github.com/Stardust-minus/vits",
        ["--depth=1"],
        () => {
            var pydependencies = [
                "Cython==0.29.21",
                "librosa==0.8.0",
                "matplotlib==3.3.1",
                "numpy==1.18.5",
                "phonemizer==2.2.1",
                "scipy==1.5.2",
                "tensorboard==2.3.0",
                "Unidecode==1.1.1",
                "pypinyin",
                "pypinyin_dict",
                "jieba",
                "web.py"
            ]
            var rest_cnt = pydependencies.length;
            输出("开始安装依赖 注意 此步骤消耗时间较多 不输出日志为正常现象 请勿退出！");
            for (const dependencie of pydependencies) {
                输出("申请安装"+dependencie)
                pipinstall(
                    dependencie,
                    () => {
                        rest_cnt --;
                        输出("剩余"+rest_cnt+"个依赖未提交安装请求");
                        // if(rest_cnt == 0) {
                        //     输出("vits 主体安装完毕");
                        // }
                    }
                )
            }
            conda_send("echo pipf")
        }
    )
}

function miniconda_install(回调函数) {
    下载(
        "https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe",
        "miniconda_installer.exe",
        ()=>{
            输出("miniconda下载完成");
            inquirer.prompt([{
                type: 'input',
                name: 'miniconda_path',
                message: '请输入你想要把miniconda安装到哪个目录(不知道直接回车)',
                default: 'D:/Miniconda3/'
            }]).then((answers) => { miniconda_path = answers.miniconda_path})
            输出("miniconda正在安装");
            let miniconda_install_process = 生成子进程('./tmp/miniconda_installer.exe',["/S","/D="+miniconda_path], {
              silent: true
            });
            miniconda_install_process.on("exit",()=>{
                输出("miniconda已完成安装");
            })
        }
    )
}

function conda_send(sts,回调函数) {
    conda.stdin.write(sts+" \n");
    // if(sts == "conda activate genshin-vitsweb") {
    //     var activater = setInterval(() => {
    //         if()
    //     }, 500);
    // }
    if(回调函数) 回调函数();
}

function activate_conda(回调函数) {
    输出('cmd',["/K",miniconda_path+'\\Scripts\\activate.bat' ,miniconda_path]);
    conda = 生成子进程('cmd',["/K",miniconda_path+'\\Scripts\\activate.bat' ,miniconda_path],{
        stdio: 'pipe'
      });
    conda.stdout.on("data",(data)=>{
        var content = data.toString()
        if(content.indexOf("(genshin-vitsweb)") != -1 && activater != null) {
            清除计时器(activater)
            activater = null
            输出("环境已搭建");
            setTimeout(vits_install,5000)
        }
        if(content.indexOf("[y]/n") != -1) {
            conda_send("y")
        }
        if(content.indexOf("y/[n]") != -1) {
            conda_send("n")
        }
        if(content.indexOf("pipf") != -1 && !ispiploaded) {
            ispiploaded = true;
            Torch_install();
        }
        if(content.indexOf("torchf") != -1 && !istorchloaded) {
            istorchloaded = true;
            monotonic_align()
        }
        if(content.indexOf("monotonic_alignff") != -1 && !ismonotonic_alignloaded) {
            ismonotonic_alignloaded = true;
            runapp()
        }
        if(调试模式) 输出(content);
    })
    if(!调试模式) {
        conda_send("conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/")
        conda_send("conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/")
        conda_send("conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/")
        conda_send("conda config --set show_channel_urls yes")
        conda_send("conda create -n genshin-vitsweb python=3.8")
        conda_send("Y")
    }
    conda_send("conda activate genshin-vitsweb")
    var activater = setInterval(()=>{
        conda_send("conda activate genshin-vitsweb")
    },15000)
    // 回调函数()
}

function env_install(回调函数) {
    输出("开始执行环境安装任务");
    var install_task_cnt = 2;
    git_install(()=>{
        install_task_cnt --;
        输出("Git完成安装 剩余任务",install_task_cnt);
    })
    miniconda_install(()=>{
        install_task_cnt --;
        输出("Miniconda完成安装 剩余任务",install_task_cnt);

    })
    var waiter = setInterval(()=>{
        if(install_task_cnt == 0) {
            // 输出(111);
            回调函数();
            清除计时器(waiter)
        }
    },200)
}
// 克隆Git(
//     ""
// )
env_install(()=>{
    输出("完成环境安装");
    输出("正在进入conda环境");
    activate_conda()
})

function Torch_install() {
    inquirer.prompt([{
        type: 'list',
        name: 'TorchVersion',
        message: '选择你的Torch安装版本 (↑ ↓选择 enter确定)',
        choices: [
            { name: 'CPU', value: 'cpu' },
            { name: 'GPU+CUDA11.6', value: 'gpu' }
        ]
    }]).then((answers) => {
        if(answers.TorchVersion == 'cpu') {
            conda_send("pip3 install torch torchvision torchaudio")
        } else {
            conda_send("pip3 install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu116")
        }
        conda_send("torchf")
    })
}

function monotonic_align() {
    conda_send("cd ./vits/monotonic_align")
    conda_send("python setup.py build_ext --inplace")
    conda_send("monotonic_alignff")
}

function runapp() {
    输出("已完成全部环境搭建 开始启动服务端");
    conda_send("cd ../../")
    调试模式 = true;
    conda_send("node app.js")
}