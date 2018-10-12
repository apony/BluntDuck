<template>
    <div class="titleView">
        <mt-header :title="title">
            <mt-button :icon="leftSlot.iconf" :slot="leftSlot.mode" @click="handleReturnAction">{{leftSlot.content}}</mt-button>
            <mt-button :icon="rightSlot.iconf" :slot="rightSlot.mode" @click="handleSearchAction"></mt-button>
        </mt-header>
    </div>
    
</template>

<script>
export default {
    name: 'AppHeader',
    props:{
        title: String,
        leftSlot: Object,
        rightSlot: Object
    },
    methods:{
        handleSearchAction(){
            this.$router.push({name:this.rightSlot.tolink})
        },
        handleReturnAction(){
            this.$router.push({name:this.leftSlot.tolink,params:{comment:'return'}})
        }
    }
}
</script>

<style scoped>
.titleView{
    height: 1.173333rem;
}
.mint-header{
    font-size: .426667rem;
}
.mint-header>>>.mintui-search{
    font-size: .426667rem;
}
</style>
