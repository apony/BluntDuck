// import Swiper from './swiper/swiper.vue'
// import SwiperItem from './swiper/swiper-item.vue'

// import TabBar from './tabs/TabBar.vue'
// import TabItem from './tabs/TabItem.vue'

import { Header } from 'mint-ui'

export default {
    //外部引入该模块后，Vue.use()调用，install方法就执行。
    install:function(Vue) {
        console.log('install执行了');
        Vue.component(Header.name, Header);
    }
}