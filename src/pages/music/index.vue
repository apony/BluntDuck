<template>
    <div>
        <app-header :title="title" :leftSlot="leftSlot" :rightSlot="rightSlot"></app-header>
        <div class="page">
            <div>音乐</div>
        </div>
        <aplayer autoplay
            :music="{
                title: 'secret base~君がくれたもの~',
                artist: 'Silent Siren',
                src: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.mp3',
                pic: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.jpg'
            }"
        />
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data(){
        return{
            title: this.$route.params.title || '音乐',
            leftSlot: {
                mode:'left',
                content:'',
                tolink:'article',
                iconf:'back'
            },
            rightSlot: {
                mode:'right',
                content:'',
                tolink:'search',
                iconf:'search'
            }
        }
    }
}
</script>

<style scoped>
.page{
    bottom: 1.76rem
}
.aplayer{
    position: fixed;
    z-index: 100;
    width: 100%;
    margin: 0px;
    left: 0;
    bottom: 0;
}
</style>
