import 'mint-ui/lib/style.css'; 
import {
     Header, Button,
     Navbar, TabItem,
     Search, Cell,
     Actionsheet
} from 'mint-ui'
import Aplayer from 'vue-aplayer'
export default {
    //外部引入该模块后，Vue.use()调用，install方法就执行。
    install:function(Vue) {
        Vue.component('Aplayer', Aplayer)

        Vue.component(Header.name, Header);
        Vue.component(Button.name, Button);
        Vue.component(Navbar.name, Navbar);
        Vue.component(TabItem.name, TabItem);
        Vue.component(Search.name, Search);
        Vue.component(Cell.name, Cell);
        Vue.component(Actionsheet.name, Actionsheet)
    }
}