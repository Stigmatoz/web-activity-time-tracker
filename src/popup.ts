import Popup from './pages/Popup.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { createApp } from 'vue';
import i18n from './plugins/i18n';

const app = createApp(Popup);
app.component('VueDatePicker', VueDatePicker);
app.use(i18n);
app.mount('body');
