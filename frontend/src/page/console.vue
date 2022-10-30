<script setup>
import Drawer from '../components/Drawer.vue';
</script>
<template>
    <div class="mdui-drawer-body-left">
        <Drawer></Drawer>
        <div class="router">
            <transition enter-active-class="animate__animated animate__fadeInUp"
                leave-active-class="animate__animated animate__fadeOutDown">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>
<style scoped>
.router {
    margin: 20px;
}
</style>