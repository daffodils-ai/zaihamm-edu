import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import i18n from './i18n.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';

const app = createApp(App)

app.use(router)
app.use(i18n)
app.mount('#app')
