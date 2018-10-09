<template>
    <div>
        <app-header :title="title"></app-header>
        <div class="page">
            <div>游戏</div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            title: this.$route.params.title || '游戏'
        }
    }
}
</script>

<style>

</style>
