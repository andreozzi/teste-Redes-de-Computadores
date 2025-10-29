import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://168.138.249.20:6262';

createApp(App).mount('#app')
