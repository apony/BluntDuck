<template>
    <div>
        <app-header :title="title" :leftSlot="leftSlot" :rightSlot="rightSlot"></app-header>
        <div class="page">
            <div>音乐</div>
        </div>
        <keep-alive>
            <aplayer ref="player" @click.native="openDetail"
                :music="currentSong"
                :list="playList"
                repeat="list"
                shuffle listFolded preload showLrc
            />
        </keep-alive>
        <router-view></router-view>
    </div>
</template>

<script>
import Vuex from 'vuex'
import bus from '@utils/pubsub.js'
import {getInitSong} from '@services/mockData.js'
import {randomEasy} from '@utils/math.js'
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
    },
    computed:{
        ...Vuex.mapState({
            songPoint: (state)=>state.song.currentSongPoint,
            playListData: (state)=>state.song.playList
        }),
        currentSong(){
            return this.playList[this.songPoint]
        },
        playList(){
            return this.playListData.map(item=>{
                return this.parseSongData(item)
            })
        }
    },
    methods:{
        play(){
            // this.$refs.player.play()
        },
        openDetail(){
            // console.log('打开列表播放详情')
        },
        parseSongData(item){
            return {
                id: item.songId,
                title: item.songName,
                artist: item.singer[0].singerName,
                src: item.songInfo[0].url,
                pic: item.picUrl,
                lrc: item.lrc
            }
        }
    },
    mounted() {
        if (!sessionStorage.getItem('songList')) {
            JSON.stringify(sessionStorage.setItem('songList','[]'))
            //mock初始歌曲数据
            getInitSong().then(initSong=>{
                this.$store.dispatch('song/modifyPlayList',initSong)
                this.$store.dispatch('song/modifyCurrentSong',this.playListData[0].songId)
                this.$router.go(0)
                this.play()
            })
        }else{
            let randomIndex = randomEasy(0,this.playListData.length)
            this.$store.dispatch('song/modifyCurrentSong',this.playListData[randomIndex].songId)
            this.play()
        }
        bus.on('playSong',()=>{
            console.log('播放音频')
            this.play()
        })
    },
    destroyed() {
        bus.rm('playSong')
    },
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
    /* height: 2.4rem; */
    margin: 0px;
    left: 0;
    bottom: 0;
}
</style>
