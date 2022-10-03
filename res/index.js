import { handle } from './proxy.js'

// 原始数据
let data = {
    'text': '',
    'speaker': '派蒙',
    'noise': '0.66',
    'noisew': '0.8',
    'length': '1.2',
    'format': 'mp3'
}
const voices = ['派蒙', '凯亚', '安柏', '丽莎', '琴', '香菱', '枫原万叶', '迪卢克', '温迪', '可莉', '早柚', '托马', '芭芭拉', '优菈', '云堇', '钟离', '魈', '凝光', '雷电将军', '北斗', '甘雨', '七七', '刻晴', '神里绫华', '戴因斯雷布', '雷泽', '神里绫人', '罗莎莉亚', '阿贝多', '八重神子', '宵宫', '荒泷一斗', '九条裟罗', '夜兰', '珊瑚宫心海', '五郎', '散兵', '女士', '达达利亚', '莫娜', '班尼特', '申鹤', '行秋', '烟绯', '久岐忍', '辛焱', '砂糖', '胡桃', '重云', '菲谢尔', '诺艾尔', '迪奥娜', '鹿野院平藏']

// 设置角色语音选项
const createOptions = () => {
    const selector = document.querySelector('.selector')
    voices.forEach((item) => selector.add(new Option(item, item)))
}

// 修改显示参数
export const changeParams = () => {
    let nodeList = document.querySelectorAll('.param')
    for (let i = 0; i < nodeList.length; i++) {
        switch (i) {
            case 0:
                nodeList[i].innerHTML = data['noise']
                break
            case 1:
                nodeList[i].innerHTML = data['noisew']
                break
            case 2:
                nodeList[i].innerHTML = data['length']
                break
        }
    }
}

// 填入数据
const getData = () => {
    const { text, speaker, noise, noisew, length, format } = data
    if (text === '')
        alert('请输入文本')
    else {
        const node = document.getElementsByTagName('audio')[0]
        let apiurl = `/api/?text=${text}&speaker=${speaker}&length=${length}&noise=${noise}&noisew=${noisew}`;
        console.log(apiurl);
        document.getElementsByClassName("hl-loading")[0].setAttribute("style","display: flex;");
        setTimeout(() => {
            document.getElementsByClassName("hl-loading")[0].setAttribute("style","display: flex;opacity: 1;");
        }, 20);
        node.setAttribute('src', apiurl)
        node.oncanplay = ()=>{
            mdui.snackbar({
                message: '已完成请求'
            });
            document.getElementsByClassName("hl-loading-text")[0].innerHTML = "加载完毕"
            setTimeout(() => {
                document.getElementsByClassName("hl-loading")[0].setAttribute("style","opacity: 0;");
                setTimeout(() => {
                    document.getElementsByClassName("hl-loading")[0].setAttribute("style","display: none;");
                }, 300);
            }, 1000);
        }
        globalThis.CanplayEvent = ()=>{
            mdui.snackbar({
                message: '任务将在后台进行'
            });
            document.getElementsByClassName("hl-loading-text")[0].innerHTML = "加载完毕"
            setTimeout(() => {
                document.getElementsByClassName("hl-loading")[0].setAttribute("style","opacity: 0;");
                setTimeout(() => {
                    document.getElementsByClassName("hl-loading")[0].setAttribute("style","display: none;");
                    document.getElementsByClassName("hl-loading-text")[0].innerHTML = "少女祈祷中"
                }, 300);
            }, 1000);
        }
        node.onerror = ()=>{
            document.getElementsByClassName("hl-loading-text")[0].innerHTML = "加载失败"
            setTimeout(() => {
                document.getElementsByClassName("hl-loading")[0].setAttribute("style","opacity: 0;");
                setTimeout(() => {
                    document.getElementsByClassName("hl-loading")[0].setAttribute("style","display: none;");
                    document.getElementsByClassName("hl-loading-text")[0].innerHTML = "少女祈祷中"

                }, 300);
            }, 1000);
        }
    }
}

// 初始化
// 对象代理
data = new Proxy(data, handle)

// 页面加载时设置角色语音选项
createOptions()

// 页面加载时设置初始值
changeParams()

//这作者写的代理不咋地啊
setInterval(()=>{
    changeParams()
},200)

// 绑定事件，数据回流时重新展示
document.querySelectorAll('.selector').forEach(item => {
    item.addEventListener('change', e => {
        if (e.target.length === 2)
            data.format = e.target.value
        else
            data.speaker = e.target.value
    })
});
document.querySelectorAll('.input-box').forEach(item => {
    item.addEventListener('input', e => data.text = e.target.value)
});
document.querySelectorAll('.slide').forEach(item => {
    item.addEventListener('input', e => {
        switch (e.target.name) {
            case 'noise':
                data['noise'] = e.target.value
                break
            case 'noisew':
                data['noisew'] = e.target.value
                break
            case 'length':
                data['length'] = e.target.value
                break
        }
    })
});

// 绑定生成语音事件
document.querySelector('.produce').addEventListener('click', () => {
    getData()
})
