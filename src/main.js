import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import boundle from './boundle'

Vue.config.productionTip = false
Vue.use(boundle)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
