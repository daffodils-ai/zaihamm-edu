import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';
import { vFormatDateTime, vFormatDate, vActive } from './utils/directives.js';

const app = createApp(App);

// Register global directives
app.directive('formatDateTime', vFormatDateTime);
app.directive('formatDate', vFormatDate);
app.directive('active', vActive);

// Use plugins
app.use(store);
app.use(router);

// Mount
app.mount('#app');
