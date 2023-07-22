import Settings from './pages/Dashboard.vue';
import Notifications from '@kyvg/vue3-notification';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { createApp } from 'vue';
import i18n from './plugins/i18n';

const app = createApp(Settings);
app.use(Notifications);
app.use(i18n);
app.component('VueDatePicker', VueDatePicker);
app.mount('body');
