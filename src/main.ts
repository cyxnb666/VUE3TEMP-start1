import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue'
import router from '@/routes/index'
import TableLayout from '@/components/TableLayout/index.vue'
import "lib-flexible/flexible.js"

const app = createApp(App);
app.use(Antd)
app.use(router)
app.component("TableLayout", TableLayout)
app.mount('#app')
