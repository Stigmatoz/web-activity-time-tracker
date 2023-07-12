import Block from './pages/Block.vue';
import { createApp } from 'vue';
import i18n from './plugins/i18n';

const app = createApp(Block);
app.use(i18n);
app.mount('body');
