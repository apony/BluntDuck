<template>
    <div>
        <app-header :title="title"></app-header>
        <div class="page">
            <div>图书</div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            title: this.$route.params.title || '图书'
        }
    }
}
</script>

<style>

</style>
