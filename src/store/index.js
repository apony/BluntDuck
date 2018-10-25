import Vue from 'vue'
import Vuex from 'vuex'

import songModule from './songInfo'

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    song: songModule
  }
})
