<template>
    <div>
        <app-header :title="title"></app-header>
        <div class="page">
            <div>文章</div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            title: this.$route.params.title || '文章'
        }
    }
}
</script>

<style>

</style>
