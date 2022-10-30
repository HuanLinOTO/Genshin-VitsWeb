import { createApp } from 'vue';

import './style.css';
import animatecss from 'animate.css';
import '../public/css/mdui.min.css';

import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';

import App from './App.vue';

import store from './store.js';

const vrouter = createRouter({
	// 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
	history: createWebHashHistory(),
	routes,
});
var app = createApp(App);
app.use(animatecss);
app.use(vrouter);
app.use(store);
app.mount('#app');
