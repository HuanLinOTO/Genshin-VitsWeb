<script setup>
import { ref } from 'vue';
import mdui from '../public/js/mdui.esm'
import Header from './components/Header.vue'
var isshow = ref(false)
console.log(111);
setInterval(() => {
  mdui.mutation()
}, 200)
</script>

<template>
  <Header></Header>
  <transition enter-active-class="animate__animated animate__fadeInLeft"
    leave-active-class="animate__animated animate__fadeOutRight">
    <router-view></router-view>
  </transition>
</template>
<style>
:root::-webkit-scrollbar {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  width: 0 !important;
}

@font-face {
  font-family: GenshinFont;
  src: url('../public/fonts/GenshinFont.ttf')
}

* {
  font-family: GenshinFont;
}

.mdui-btn {
  border-radius: 166px;
}
</style>