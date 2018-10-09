<template>
    <div>
        <app-header :title="title"></app-header>
        <div class="page">
            <div>音乐</div>
        </div>
    </div>
</template>

<script>
import {getBangumiBook} from '@services'
export default {
    data(){
        return{
            title: this.$route.params.title || '音乐'
        }
    },
    mounted(){
        getBangumiBook({
            kw:'海贼王'
        }).then(res=>{
            console.log(res)
        })
    }
}
</script>

<style>

</style>
