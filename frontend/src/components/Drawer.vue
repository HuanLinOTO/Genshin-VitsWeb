<script setup>
import { ref } from 'vue';
import drawerData from '../assets/drawer.json'
console.log(drawerData);

var activateItem = ref("主页")
</script>
<template>
    <div class="mdui-drawer" id="drawer">
        <ul class="mdui-list">
            <div v-for="(item,index) in drawerData" :key="item">
                <router-link tag="li" :to="''+item.path" class="mdui-list-item mdui-ripple"
                    :class="activateItem == item.data?'mdui-list-item-active':''" v-if="item.type == 'item'"
                    @click="activateItem = item.data">
                    <i class="mdui-list-item-icon mdui-icon material-icons">{{item.icon}}</i>
                    <div class="mdui-list-item-content">{{item.data}}</div>
                </router-link>
                <li class="mdui-subheader" v-else>{{item.data}}</li>
            </div>
        </ul>
    </div>
</template>
