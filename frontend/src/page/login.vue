<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex'
import mdui from '../../public/js/mdui.esm'
import clipboard from 'clipboard'

const store = useStore()
// console.log(store.state.config.backend + "loginCheck");
var logintarget = ref("正在获取")
var username = ref("Unknow")
var logined = ref(false)

var ws = new WebSocket(store.state.config.backend + "loginCheck");
globalThis.ws = ws;
ws.onmessage = (message) => {
    var data = JSON.parse(message.data);
    if (data.type == "target")
        logintarget.value = data.data;
    else {
        username.value = data.data
        localStorage.username = data.data;
        logined.value = true;
    }
    new ClipboardJS('#copytarget');
}
ws.onclose = () => {
    restSecond.value = 0;
}
var restSecond = ref(60);
var restTimmer = setInterval(() => {
    if (restSecond <= 0) {
        clearInterval(restTimmer)
        return;
    }
    restSecond.value--;
}, 1000)
// new Clipboard();
</script>
<template>
    <div class="mdui-card mdui-center">
        <div v-if="!logined">
            <div class="mdui-typo-display-1 title">登录</div>
            <div style="margin: 30px">
                <div class="mdui-typo-title">您的令牌(点击复制):</div>
                <button id="copytarget" class="mdui-btn mdui-color-black" data-clipboard-action="copy"
                    data-clipboard-target="#target" @click="mdui.snackbar({message:'您已复制'})">{{logintarget}}
                </button>
                <div class="mdui-typo-subheading">
                    在QQ群内发送 <span class="mdui-color-red">#登录 您的令牌</span> 以验证您的账号
                </div>
                <div class="mdui-typo-subheading" v-if="restSecond > 0">
                    请在{{restSecond}}秒内完成验证
                </div>
                <div class="mdui-typo-subheading mdui-typo" v-else>
                    令牌已过期 请<a href="javascript:location.reload();">刷新</a>获取新的令牌
                </div>
                <!-- 捏🐎的这玩意怎么这么难塞 -->
                <input type="text" style="margin-top: 100vh;" id="target" :value="logintarget">
            </div>
        </div>
        <div v-else>
            <div class="mdui-typo-display-1 title">您已登录</div>
            <div style="margin: 30px">
                <div class="mdui-typo-title">User: {{username}}</div>
                <div class="mdui-card-actions">
                    <router-link to="/console/index" class="mdui-btn mdui-color-pink mdui-center">前往控制台</router-link>
                </div>
            </div>

        </div>
    </div>
</template>
<style scoped>
.mdui-card {
    margin-top: 15vh;
    margin-bottom: 15vh;
    height: 70vh;
    width: 25vw;
}

.title {
    margin-top: 15px;
    text-align: center;
}

.mdui-color-black {
    margin-bottom: 100px;
    margin-top: 100px;
    width: 100%;
}
</style>