<template>
    <div>
        <app-header :title="title" :leftSlot="leftSlot" :rightSlot="rightSlot"></app-header>
        <div class="page">
            <div>音乐</div>
        </div>
        <keep-alive>
            <aplayer ref="player" repeat="list"
                :music="currentPlay[0]"
                :list='playList'
                @play="onPlayerPlay($event)"
                @pause="onPlayerPause($event)"
                @ended="onPlayerEnded($event)"
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
            playList:[],
            currentPlay:[{
                id: 0,
                title: 'secret base~君がくれたもの~',
                artist: 'Silent Siren',
                src: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.mp3',
                pic: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.jpg'
            }]
        }
    },
    methods:{
        play(){
            this.$refs.player.play()
        },
        onPlayerPlay(){
            console.log('onPlayerPlay',this.currentPlay)
        },
        onPlayerPause(){
            console.log('onPlayerPause',this.currentPlay)
        },
        onPlayerEnded(){
            console.log('onPlayerEnded',this.currentPlay)
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
                    src: currentSong.songInfo[0].url
                })
            }
            this.currentPlay.splice(0,1,{
                id: currentSong.songId,
                title: currentSong.songName,
                artist: currentSong.singer[0].singerName,
                src: currentSong.songInfo[0].url
            })
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
