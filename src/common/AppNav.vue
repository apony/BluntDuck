<template>
    <nav  class="app-nav">
        <ul class="app-list">
            <li v-for="(item,index) in item_name" :key="index" 
                class="app-item ac" @click="iconSelect(index)">
                    <!-- :class="key:value" key为显示的class名称，value是否取用。此外key取变量时需加上[]加以区分 -->
                    <i class="iconfont app-iconf" :class="{[item_className[index]]:true,[item_hover[index]]:true}">
                    </i>
                    <span class="title" :class="{[item_hover[index]]:true}">{{item}}</span>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    data(){
        return{
            item_name:['文章','游戏','图书','音乐'],
            item_className:['icon-yuedu','icon-youxi','icon-tushu','icon-music'],
            item_hover:['select','','','']
        }
    },
    methods:{
        iconSelect(i){
            //清空之前的.select
            this.item_hover.map((item,index)=>{
                if(item=="select"){
                    //vue对数组的数据检测有严格规定,与对象一样。详情看官网
                    //传送门 => https://cn.vuejs.org/v2/guide/list.html#%E6%95%B0%E7%BB%84%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B
                    this.item_hover.splice(index,1,'')
                    return
                }
            })
            this.item_hover.splice(i,1,'select')
        }
    }
}
</script>

<style scoped>
.app-nav{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 49px;
}
.app-list{
    height: 100%;
    display: flex;
    flex-direction: row;
}
.app-item{
    height: 100%;
    flex: 1
}
.app-iconf{
    font-size: 25px;
}
.title{
    display: block;
    color: #0084B4;
}
.select{
    color: #f09199;
}
</style>
