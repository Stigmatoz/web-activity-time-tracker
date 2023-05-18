import Popup from './pages/Popup.vue';
import { router } from './router';
import { createApp } from 'vue';

createApp(Popup).use(router).mount('body');
