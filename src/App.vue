<template>
    <div>
        <div>test</div>
        <i class="iconfont icon-tushu"></i>
        <router-view></router-view>  
    </div>
  
</template>

<script>
import {getBangumiBook} from './services'
export default {
    data(){
        return{

        }
    },
    methods:{
        
    },
    mounted(){
        // getBangumiBook({
        //     kw:'神奇宝贝',
        //     catid:'',
        //     pageToken:2
        // })
        // .then(res=>{
        //     console.log(res)
        // })
    }
}
</script>

<style>

</style>
