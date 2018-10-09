import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import boundle from './boundle'
import AppHeader from './common/AppHeader.vue'

Vue.component(AppHeader.name,AppHeader)

Vue.config.productionTip = false
//创建空实例进行传值
Vue.prototype.center=new Vue();
//封装插件(mint-ui)
Vue.use(boundle)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
