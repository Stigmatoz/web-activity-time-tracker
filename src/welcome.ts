import Welcome from './pages/Welcome.vue';
import { createApp } from 'vue';
import i18n from './plugins/i18n';

const app = createApp(Welcome);
app.use(i18n);
app.mount('body');
