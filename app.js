var express = require('express');
const cp = require('child_process');
var app = express();
globalThis.app = app;
const process = require('process'); 
const { readFileSync } = require('fs');
const { chdir } = require('process');
// process.chdir("../")
npcList = ['派蒙', '凯亚', '安柏', '丽莎', '琴', '香菱', '枫原万叶',
           '迪卢克', '温迪', '可莉', '早柚', '托马', '芭芭拉', '优菈',
           '云堇', '钟离', '魈', '凝光', '雷电将军', '北斗',
           '甘雨', '七七', '刻晴', '神里绫华', '戴因斯雷布', '雷泽',
           '神里绫人', '罗莎莉亚', '阿贝多', '八重神子', '宵宫',
           '荒泷一斗', '九条裟罗', '夜兰', '珊瑚宫心海', '五郎',
           '散兵', '女士', '达达利亚', '莫娜', '班尼特', '申鹤',
           '行秋', '烟绯', '久岐忍', '辛焱', '砂糖', '胡桃', '重云',
           '菲谢尔', '诺艾尔', '迪奥娜', '鹿野院平藏']
app.use('/res', express.static('res'))
app.use('/assets', express.static('res'))

app.use('/', express.static('page'))
app.get('/api', function (req, res) {
    console.log("请求接入");
    // res.send('Hello World');
    chdir("./vits")
    const get = req.query;
    if(get.speaker == undefined || get.text == undefined) {
        res.sendStatus(400)
        return;
    }
    if(npcList.indexOf(get.speaker) == -1) {
        res.sendStatus(400) 
        return;
    }
    var speaker = get.speaker;
    var text = get.text;
    var noise = get.noise || 0.667;
    var noisew = get.noisew || 0.8;
    var length = get.length || 1.2;

    const child3 = cp.spawn('python',["./gent.py",speaker,text,noise,noisew,length], {
        silent: true
    });
      
    child3.stdout.setEncoding('utf8');
    child3.stdout.on('data', function (data) {
        console.log('stdout 中输出：');
        console.log(data.toString());
    });
    child3.stderr.on('data', function (data) {
        console.log('stdout 中输出：');
        console.log(data.toString());
    });
    child3.on("exit",()=>{
        console.log("进程退出");
        res.setHeader('Content-Type','audio/wav');
        res.send(readFileSync("./output.wav"))
        chdir("../")
        // res.send({msg:"生成完毕 请自行查看"})
    })

})

var server = app.listen(8881, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://127.0.0.1:8881")

})