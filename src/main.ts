import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VueTheMask from 'vue-the-mask';
import quasarPlugin from './plugins/quasar';

const app = createApp(App);
const pinia = createPinia();
(app as any).use(VueTheMask);
app.use(quasarPlugin);
app.use(pinia);
app.use(router);
app.mount('#app');
