import Settings from './pages/Dashboard.vue';
import Notifications from '@kyvg/vue3-notification';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { createApp } from 'vue';

const app = createApp(Settings);
app.use(Notifications);
app.component('VueDatePicker', VueDatePicker);
app.mount('body');
