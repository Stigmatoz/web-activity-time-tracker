import Popup from './pages/Popup.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { createApp } from 'vue';

const app = createApp(Popup);
app.component('VueDatePicker', VueDatePicker);
app.mount('body');
