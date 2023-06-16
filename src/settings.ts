import Settings from './pages/Settings.vue';
import Notifications from '@kyvg/vue3-notification';
import { createApp } from 'vue';

const app = createApp(Settings);
app.use(Notifications);
app.mount('body');
