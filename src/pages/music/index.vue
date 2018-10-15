<template>
    <div>
        <app-header :title="title" :leftSlot="leftSlot" :rightSlot="rightSlot"></app-header>
        <div class="page">
            <div>音乐</div>
        </div>
        <keep-alive>
            <aplayer ref="player"
                :music="playList[0]"
                :list="playList"
                repeat="list"
                autoplay shuffle listFolded preload
            />
        </keep-alive>
        <router-view></router-view>
    </div>
</template>

<script>
import bus from '@utils/pubsub.js'
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
            },
            playList:[{
                title: '前前前世',
                artist: 'RADWIMPS',
                src: 'https://moeplayer.b0.upaiyun.com/aplayer/yourname.mp3',
                pic: 'https://moeplayer.b0.upaiyun.com/aplayer/yourname.jpg',
                lrc: 'https://moeplayer.b0.upaiyun.com/aplayer/yourname.lrc',
            }]
        }
    },
    methods:{
        play(){
            this.$refs.player.play()
        }
    },
    mounted() {
        bus.on('addSong',(currentSong)=>{
            let isHas = false
            this.playList.map(item=>{
                if(item.id === currentSong.songId){
                    isHas = true
                }
            })
            if (!isHas) {
                this.playList.push({
                    id: currentSong.songId,
                    title: currentSong.songName,
                    artist: currentSong.singer[0].singerName,
                    src: currentSong.songInfo[0].url,
                    pic: currentSong.songInfo[0].pic
                })
            }
        })
        bus.on('playSong',()=>{
            this.play()
        })
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
