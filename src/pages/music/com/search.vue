<template>
    <div>
        <div class="list">
            <mt-search  placeholder="搜索"  v-model="searchWord" @input="searchRes">
                <div class="nav">
                    <div class="nav-wrapper">
                        <mt-button size="small" v-for="(tabItem,tabIndex) in searchType" @click.native.prevent="searchActive = tabItem" :class="tabItem===searchActive?'toggleTabActive':''">{{searchTitle[tabIndex]}}</mt-button> 
                    </div>
                </div>
                <div class="page-tab-container">
                    <mt-tab-container v-model="searchActive">
                        <mt-tab-container-item v-for="(tabItem,tabIndex) in searchType" :key="tabIndex" :id="tabItem">
                            <!--单曲搜索-->
                            <div v-if="tabItem==='singleSong'">
                                <mt-cell
                                    v-for="(item,index) in singleSongList"
                                    :key="index"
                                    :title="handleTitleData(item.songName)"
                                    :label="handleDescribeData(item)"
                                    @click.native="handleAjaxCurrentSongInfo(index)"
                                    >
                                    <span class="more" @click="moreAction(index)">...</span>
                                </mt-cell>
                            </div>

                        </mt-tab-container-item>
                    </mt-tab-container>
                </div>
            </mt-search>
            <mt-actionsheet
            :actions="moreList" cancelText="取消"
            v-model="isMoreFlag">
            </mt-actionsheet>
            <div class="gobackbtn" @click="handleGobackAction"><</div>
            <div class="content" v-show="isSearch">
                <div class="title">热门搜索</div>
                <ul class="hotList">
                    <li v-for="(item,index) in hotSearchList" :key="index" @click="handleHotSearchAction(index)">{{item.first}}</li>
                </ul>
            </div>
        </div>
        
    </div>
</template>

<script>
import {
    getNetEaseMusicSearch,
    getNetEaseMusicHotSearch,
    getNetEaseMusicUrl,
    getNetEaseMusicAlbum,
    getNetEaseMusicLyric,
    getNetEaseMusicCheckCopyright
} from '@services'
import {
    filterDescribe,
    filterSongName,
    filterSongLength
} from '@filters/songInfoFilter.js'
import bus from '@utils/pubsub.js'
export default {
    data(){
        return{
            value:'',
            isSearch: true,
            singleSongList: [],
            hotSearchList:[],
            searchWord:'',
            //更多的底部模态框判断
            isMoreFlag:false,
            downLoadIndex:0,
            moreList:[{
                name: '下载',
                method: this.downLoadingMusic
            }],
            //请求当前歌曲数据
            isAjaxData:true,
            //搜索类型
            searchType:[
                'singleSong','video','singer','album','songList','radio','user'
            ],
            searchTitle:[
                '单曲','视频','歌手','专辑','歌单','主播电台','用户'
            ],
            searchActive:'singleSong',

            
        }
    },
    methods:{
        searchRes(keyword){
            //原因：input事件为高频繁触发事件，会不经意增加向服务器请求的次数 解决：延时请求
            if(this.timer){
                this.singleSongList = []
                clearTimeout(this.timer);
            }
            if(keyword){
                this.timer = setTimeout(() => {
                    this.isSearch = false;
                    getNetEaseMusicSearch(keyword,1,20).then(res=>{
                        if (res) {
                            this.singleSongList = res
                        }
                    })
                }, 400)
            }else{
                getNetEaseMusicHotSearch().then(res=>{
                    if (res) {
                        this.hotSearchList = res
                        this.isSearch = true
                    }
                    
                })
            }
        },
        handleGobackAction(){
            this.$router.go(-1)
        },
        handleDescribeData(songInfo){
            return filterDescribe(songInfo)
        },
        handleTitleData(name){
            return filterSongName(name)
        },
        handleHotSearchAction(index){
            this.searchWord = this.hotSearchList[index].first
        },
        downLoadingMusic(){
            window.open(this.getDownLoadUrl(this.downLoadIndex),'_blank')
            this.isAjaxData = true
        },
        getDownLoadUrl(currentIndex){
            //使用官方外链url地址，不需要请求url接口
            return `http://music.163.com/song/media/outer/url?id=${this.singleSongList[currentIndex].songId}.mp3`
        },
        addSongList(currentIndex){
            this.$store.dispatch('song/modifyCurrentSong',currentIndex)
            let isExist = false
            this.$store.state.song.playList.map(item=>{
                if(item.songId === this.singleSongList[currentIndex].songId){
                    isExist = true
                }
            })
            if(!isExist){
                this.$store.dispatch('song/modifyPlayList',this.singleSongList[currentIndex])
            }
            
        },
        handleAjaxCurrentSongInfo(currentIndex){
            let pm = this.ajaxCopyrightAsyn(currentIndex)
            if(this.isAjaxData){
                //链式promise结构解决多个异步按顺序响应数据
                pm.then((isCopyright)=>{
                    if (isCopyright) {
                        return this.ajaxLyricAsyn(currentIndex)
                    }
                    else{
                        console.log('当前歌曲没有版权!')
                    }
                })
                .then(()=>{
                    return this.ajaxUrlAsyn(currentIndex)
                })
                .then(()=>{
                    return this.ajaxAlbumPicAsyn(currentIndex)
                })
                .then(()=>{
                    this.addSongList(currentIndex)
                })
            }
            
        },
        //获取指定歌曲版权
        ajaxCopyrightAsyn(currentIndex){
            return new Promise((resolve=>{
                getNetEaseMusicCheckCopyright(this.singleSongList[currentIndex].songId).then(res=>{
                    if(res.message==='ok'){
                        resolve(res.success)
                    }
                })
            }))
        },
        //获取指定歌曲基本信息
        ajaxUrlAsyn(currentIndex){
            return new Promise(resolve=>{
                getNetEaseMusicUrl(this.singleSongList[currentIndex].songId).then(res=>{
                    if (res) {
                        this.singleSongList[currentIndex].songInfo = res
                        resolve()
                    }
                    
                })
            })
        },
        //获取指定歌曲属性信息
        ajaxAlbumPicAsyn(currentIndex){
            return new Promise(resolve=>{
                getNetEaseMusicAlbum(this.singleSongList[currentIndex].alibumId).then(res=>{
                    if (res) {
                        this.singleSongList[currentIndex].picUrl = res.album.picUrl
                        this.singleSongList[currentIndex].songLength = filterSongLength(res.songsInfo[0].dt)
                        resolve()
                    }
                })
            })
        },
        //获取指定歌曲的歌词
        ajaxLyricAsyn(currentIndex){
            return new Promise(resolve=>{
                getNetEaseMusicLyric(this.singleSongList[currentIndex].songId).then(res=>{
                    if (res) {
                        this.singleSongList[currentIndex].lrc = !res.nolyric?res.lyric:''
                        resolve()
                    }
                })
            })
        },
        moreAction(currentIndex){
            if (!this.isMoreFlag) {
                this.downLoadIndex = currentIndex
                this.isMoreFlag = true
                this.isAjaxData = false
            }
            
        }
    },
    mounted() {
        getNetEaseMusicHotSearch().then(res=>{
            this.hotSearchList = res
        })
    },
}
</script>

<style scoped>
.list{
    width: 2000px;
    height: 50px;
}
a:hover {
    text-decoration: none;
}
.mint-search{
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: white;
    z-index: 5;
}
.gobackbtn{
    position: absolute;
    color: #f8f3f3;
    left: .133333rem;
    top: .24rem;
    width: .613333rem;
    height: .613333rem;
    font-size: .56rem;
    z-index: 6;
    transform: scale(0.8,1.4);
}
.nav{
    width: 100%;
    overflow-x: auto;
    height: 1.2rem;
}
.nav .nav-wrapper{
    width: 150%;
    height: 100%;
    background: #03a9f4;
}
.nav>>>.mint-button{
    float: left;
    width: 2.133333rem;
    height: 1.333333rem;
    color: white;
    background: #03a9f4;
    font-weight: 500;
}
.nav>>>.mint-button-text{
    padding-bottom: .08rem;
    border-bottom: .053333rem solid transparent;
}
.nav .toggleTabActive>>>.mint-button-text{
    border-bottom: .053333rem solid white;
}
.mint-search>>>.mint-search-list-warp{
    overflow: hidden;
}
.mint-search>>>.mint-searchbar{
    background-color:#03a9f4;
    padding: .106667rem .266667rem;
}
.mint-search>>>.mint-searchbar-inner{
    border-bottom: 1px solid #f8f3f3;
    background-color:#03a9f4;
    height: .746667rem;
    padding: .16rem .16rem .133333rem 0;
    margin-left: .533333rem
}
.mint-search>>>.mint-searchbar-core{
    background-color:#03a9f4;
    color:#f8f3f3;
    text-indent: .133333rem;
    font-size: .426667rem;
}
.mint-search>>>.mint-searchbar-core[type=search]::-webkit-search-cancel-button{
    -webkit-appearance: none;
}
.mint-search>>>.mint-searchbar-core::-webkit-input-placeholder{
    color:#f8f3f3;
    font-size: .373333rem;
}
.mint-search>>>.mint-searchbar-core::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#f8f3f3;
    font-size: .373333rem;
}
.mint-search>>>.mint-searchbar-core:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#f8f3f3;
    font-size: .373333rem;
}
.mint-search>>>.mint-searchbar-core:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
    color:#f8f3f3;
    font-size: .373333rem;
}
.mint-search>>>.mint-searchbar-cancel{
    margin-left: 0;
    display: none;
}
.mint-search>>>.mintui-search{
    font-size: .426667rem;
}
.mint-search>>>.mint-tab-container{
    position: absolute;
    width: 100%;
    left: 0;
    top: 2.4rem;
    bottom: 2.4rem;
    overflow-y: auto
}
.mint-search>>>.mint-cell-text{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: nowrap;
}
.mint-search>>>.mint-cell-wrapper{
    margin-top: .1rem;
    float: left;
}
.more{
    font-size: .693333rem;
    transform: rotate(90deg);
}
.content{
    position: absolute;
    width: 100%;
    top: 1.28rem;
    left: 0;
    bottom: 1.76rem;
    z-index: 6;
}
.content .title{
    font-size: .373333rem;
    font-weight: 600;
    margin: .213333rem .16rem;
}
.hotList li{
    float: left;
    font-size: .373333rem;
    padding: .16rem .266667rem;
    margin: .133333rem;
    border-radius: .4rem;
    background-color: #eeeeee;
}
</style>
