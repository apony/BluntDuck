<template>
    <div>
        <app-header :title="title" :leftSlot="leftSlot" :rightSlot="rightSlot"></app-header>
        <div class="page">
            <div>文章</div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            title: this.$route.params.title || '文章',
            leftSlot: {
                mode:'left',
                content:'',
                tolink:'',
                iconf:''
            },
            rightSlot: {
                mode:'right',
                content:'',
                tolink:'',
                iconf:''
            }
        }
    }
}
</script>

<style>

</style>
