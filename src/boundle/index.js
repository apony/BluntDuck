// import Swiper from './swiper/swiper.vue'
// import SwiperItem from './swiper/swiper-item.vue'

// import TabBar from './tabs/TabBar.vue'
// import TabItem from './tabs/TabItem.vue'
import 'mint-ui/lib/style.css'; 
import { Header, Button } from 'mint-ui'

export default {
    //外部引入该模块后，Vue.use()调用，install方法就执行。
    install:function(Vue) {
        // console.log('install执行了');
        Vue.component(Header.name, Header);
        Vue.component(Button.name, Button);
    }
}