import index from './page/index.vue';
import login from './page/login.vue';
import console from './page/console.vue';

import consoleIndex from './page/console/index.vue';
import consoleStatistics from './page/console/statistics.vue';
import consoleDevtool from './page/console/devtool.vue';
import consoleStore from './page/console/store.vue';
import consoleMessage from './page/console/message.vue';
import consoleInfo from './page/console/info.vue';

export default [
	{ path: '/', component: index },
	{ path: '/login', component: login },
	{
		path: '/console',
		component: console,
		children: [
			{
				path: 'index',
				component: consoleIndex,
			},
			{
				path: 'statistics',
				component: consoleStatistics,
			},
			{
				path: 'devtool',
				component: consoleDevtool,
			},
			{
				path: 'store',
				component: consoleStore,
			},
			{
				path: 'message',
				component: consoleMessage,
			},
			{
				path: 'info',
				component: consoleInfo,
			},
		],
	},
];
