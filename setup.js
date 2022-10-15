import axios from "axios";
import { spawn } from "child_process";
import { statSync, mkdirSync, createWriteStream } from "fs";
import { query } from 'windows-shortcuts';  
import { chdir, exit } from "process";
import { clearInterval } from "timers";
import inquirer from 'inquirer'
import fs from 'fs'
var miniconda_path;
var activater;
var conda = null;
var ispiploaded = false;
var istorchloaded = false;
var ismonotonic_alignloaded = false;

var debug = process.argv[2] == "-dev";
var rc = process.argv[2] == "-rc";
var finished = process.argv[2] == "-finished";


// debug = true;

const download = (url,name,callback)=>{
    if(debug) {
        callback();
        return;
    }
    axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    })
    .then(function (response) {
        try {
            statSync("./tmp")
        } catch(e) {
            mkdirSync("./tmp")
        }
        const writer = createWriteStream('./tmp/'+name);
        response.data.pipe(writer)
        writer.on('close', () => {
            callback()
        })
        // callback()
    });
}

const unzip = (path,outpath,callback)=>{
    if(debug) {
        callback();
        return;
    }
    var unzip_process = spawn('./7z.exe',["x","./tmp/"+path,"-o"+outpath], {
        silent: true
    });
    unzip_process.on("exit",()=>{
        console.log("[7zip] 解压完毕");
        callback()
    })
}

const gitclone = (url,options,callback) => {
    if(debug) {
        callback();
        return;
    }
    var git_process = spawn('./git/bin/git.exe',["clone",...options,url], {
        silent: true
    });
    git_process.on("exit",()=>{
        console.log("[git] 仓库克隆完毕");
        callback()
    })
}

const pipinstall = (name,callback) => {
    if(debug) {
        callback();
        conda_send("pip install "+name+" -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com")
        return;
    }
    conda_send("pip install "+name+" -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com")
}

function git_install(callback) {
    if(debug) {
        callback();
        return;
    }
    console.log("正在下载 Git");
    download(
        "https://ghproxy.com/github.com/git-for-windows/git/releases/download/v2.38.0.windows.1/PortableGit-2.38.0-64-bit.7z.exe",
        "git.7z.exe",
        () => {
            console.log("完成");
            console.log("开始解压");
            unzip(
                "git.7z.exe","git",
                callback
            )
        }
    )
}

function vits_install(callback) {
    // if(debug) {
    //     callback();
    //     return;
    // }
    console.log("开始克隆Vits仓库");
    gitclone(
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
            console.log("开始安装依赖 注意 此步骤消耗时间较多 不输出日志为正常现象 请勿退出！");
            for (const dependencie of pydependencies) {
                console.log("申请安装"+dependencie)
                pipinstall(
                    dependencie,
                    () => {
                        rest_cnt --;
                        console.log("剩余"+rest_cnt+"个依赖未提交安装请求");
                        // if(rest_cnt == 0) {
                        //     console.log("vits 主体安装完毕");
                        // }
                    }
                )
            }
            conda_send("echo pipf")
        }
    )
}

function miniconda_install(callback) {
    download(
        "https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe",
        "miniconda_installer.exe",
        ()=>{
            console.log("miniconda下载完成");
            inquirer.prompt([{
                type: 'input',
                name: 'miniconda_path',
                message: '请输入你想要把miniconda安装到哪个目录(不知道直接回车)',
                default: 'D:/Miniconda3/'
            }]).then((answers) => { 
                miniconda_path = answers.miniconda_path
                console.log("miniconda正在安装");
                let miniconda_install_process = spawn('./tmp/miniconda_installer.exe',["/S","/D="+miniconda_path], {
                  silent: true
                });
                miniconda_install_process.on("exit",()=>{
                    console.log("miniconda已完成安装");
                    callback();
                })
            })
        }
    )
}

function conda_send(sts,callback) {
    conda.stdin.write(sts+" \n");
    // if(sts == "conda activate genshin-vitsweb") {
    //     var activater = setInterval(() => {
    //         if()
    //     }, 500);
    // }
    if(callback) callback();
}

function activate_conda(callback) {
    console.log('cmd',["/K",miniconda_path+'Scripts/activate.bat' ,miniconda_path]);
    conda = spawn('cmd',["/K",miniconda_path+'Scripts/activate.bat' ,miniconda_path],{
        stdio: 'pipe'
      });
    conda.stdout.on("data",(data)=>{
        var content = data.toString()
        if(content.indexOf("(genshin-vitsweb)") != -1 && activater != null) {
            clearInterval(activater)
            activater = null
            console.log("环境已搭建");
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
        if(debug) console.log(content);
    })
    if(!debug) {
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
    // callback()
}

function env_install(callback) {
    if(rc) {
        miniconda_path = "D:/Miniconda3/"
        callback();
        return;
    }
    console.log("开始执行环境安装任务");
    var install_task_cnt = 2;
    git_install(()=>{
        install_task_cnt --;
        console.log("Git完成安装 剩余任务",install_task_cnt);
    })
    miniconda_install(()=>{
        install_task_cnt --;
        console.log("Miniconda完成安装 剩余任务",install_task_cnt);

    })
    var waiter = setInterval(()=>{
        if(install_task_cnt == 0) {
            // console.log(111);
            callback();
            clearInterval(waiter)
        }
    },200)
}
// gitclone(
//     ""
// )
env_install(()=>{
    console.log("完成环境安装");
    console.log("正在进入conda环境");
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
    console.log("已完成全部环境搭建 开始启动服务端");
    conda_send("cd ../../")
    debug = true;
    conda_send("npm i")
    conda_send("node app.js")
}