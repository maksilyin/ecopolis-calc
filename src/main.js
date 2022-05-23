import Vue from 'vue'
import { store } from './store'
import App from './App.vue'
import styles from "./assets/styles.sass"
const VueInputMask = require('vue-inputmask').default
Vue.use(VueInputMask)
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
