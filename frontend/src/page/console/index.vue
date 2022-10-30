<script setup>
import { ref } from "@vue/reactivity";
import { useRouter } from 'vue-router'
const router = useRouter();

var username = ref(localStorage.username);
</script>
<template>
    <div class="mdui-typo-display-2">
        您好 {{ username }}
    </div>
    <div class="mdui-row">
        <div class="mdui-col-xs-3">
            <div class="mdui-panel">
                <div class="mdui-panel-item mdui-panel-item-open">
                    <div class="mdui-panel-item-header">个人数据</div>
                    <div class="mdui-panel-item-body">
                        <p>剩余调用次数: </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>