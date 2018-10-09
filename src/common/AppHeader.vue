<template>
    <div class="titleView">
            <mt-header :title="title">
                <router-link to="/" slot="left">
                    <mt-button icon="back">返回</mt-button>
                </router-link>
                <mt-button icon="more" slot="right"></mt-button>
            </mt-header>
    </div>
    
</template>

<script>
export default {
    name: 'AppHeader',
    props:{
        title: String
    },
    
}
</script>

<style scoped>
.titleView{
    height: 1.173333rem;
}

</style>
