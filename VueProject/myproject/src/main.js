// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VeeValidate from 'vee-validate'
import Vuelidate from 'vuelidate'
import VueAlertify from "vue-alertify"
import VueSimpleAlert from "vue-simple-alert";
// Import the CSS or use your own!
// const options = {
//     position: 'bottom-right'
// }
// import Drag from 'sortablejs'

Vue.use(VueSimpleAlert);
Vue.use(VueAlertify)
Vue.use(VeeValidate)
Vue.use(Vuelidate)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
