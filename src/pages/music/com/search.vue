<template>
    <div>
        <div class="list">
            <mt-search  :placeholder="recommendSearch"  v-model="searchWord" @input="searchRes" :class="searchWord===''&&!isHotSearch?'searchBar':''">
                <div class="nav">
                    <div class="nav-wrapper">
                        <mt-button size="small" v-for="(tabItem,tabIndex) in searchType" :key="tabIndex"
                            @click.native.prevent="searchAction(tabItem)"
                            :class="tabItem===searchActive?'toggleTabActive':''"
                        >{{searchTitle[tabIndex]}}</mt-button> 
                    </div>
                </div>
                <div class="page-tab-container">
                    <mt-tab-container v-model="searchActive">
                        <mt-tab-container-item v-for="(tabItem,tabIndex) in searchType" :key="tabIndex" :id="tabItem">
                            <!--单曲搜索-->
                            <div v-if="tabItem===SEARCHCONDITION.SINGLESONG" class="songCell">
                                <mt-cell
                                    v-for="(item,index) in singleSongObj.singleSongList"
                                    :key="index"
                                    @click.native="handleAjaxCurrentSongInfo(index)"
                                >
                                    <ul class="songInfo">
                                        <li class="songTitle" v-html="item.songName"></li>
                                        <li class="singer" v-html="handleFilterData(item,'music','songDescribe')"></li>
                                        <span class="more" @click="moreAction(index)">...</span>
                                    </ul>
                                    
                                </mt-cell>
                            </div>
                            <!--视频搜索-->
                            <div v-if="tabItem===SEARCHCONDITION.VIDEO" class="videoCell">
                                <mt-cell
                                    v-for="(item,index) in videoObj.videoList"
                                    :key="index">
                                    <p class="videoTitle" v-html="item.title"></p>
                                    <p class="videoInfo"
                                        v-html="handleFilterData(item.duration,'video','videoLength')+handleFilterData(item.creator,'video','videoCreator')">
                                    </p>
                                    <img slot="icon" :src="item.coverUrl" width="135" height="75">
                                    <span slot="icon" class="playTime">
                                        <i class="iconfont playIcon">&#xe611;</i>
                                        <span class="playNum">{{handleFilterData(item.playTime,'video','videoPlayTime')}}</span>
                                    </span>
                                </mt-cell>
                            </div>
                            <!-- 歌手搜索 -->
                            <div v-if="tabItem===SEARCHCONDITION.SINGER" class="singerCell">
                                <mt-cell
                                    v-for="(item,index) in singerObj.singerList"
                                    :key="index">
                                    <div class="cover" slot="icon"
                                        :style="item.singerCover
                                            ?{backgroundImage:'url(' +item.singerCover +')'}
                                                :{backgroundImage:'url(' +item.standbyCover +')'}">
                                    </div>
                                    <span slot="icon" class="singerName">{{item.singerName}}</span>
                                    <span v-if="item.accountId" class="enter">
                                        <i class="iconfont userIcon">&#xe769;</i>
                                        <span class="enterText">已入驻</span>
                                    </span>
                                </mt-cell>
                            </div>
                            <div v-if="tabItem===SEARCHCONDITION.ALBUM" class="albumCell">
                                <mt-cell
                                    v-for="(item,index) in albumObj.albumList"
                                    :key="index">
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
            <div class="content" v-show="isHotSearch">
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
    filterSongDescribe,
    filterSongLength
} from '@filters/music/songInfoFilter.js'
import {
    filterVideoPlayTime,
    fliterVideoCreator,
    filterVideoLength
} from '@filters/music/videoInfoFilter.js'
import bus from '@utils/pubsub.js'
export default {
    data(){
        return{
            value:'',
            isHotSearch: true,
            //单曲数据
            singleSongObj: {
                singleSongList:[],
                singleSongLength: 0
            },
            //视频数据
            videoObj: {
                videoList:[],
                videoLength: 0
            },
            //歌手数据
            singerObj:{
                singerList:[],
                singerLength: 0
            },
            //专辑数据
            albumObj:{
                albumList: [],
                albumLength: 0
            },
            hotSearchList:[],
            searchWord:'',
            recommendSearch:'云村有票',
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
                '1','1014','100','10','1000','1009','1002'
            ],
            searchTitle:[
                '单曲','视频','歌手','专辑','歌单','主播电台','用户'
            ],
            searchActive:'1',

            SEARCHCONDITION:{
                SINGLESONG: '1',
                VIDEO: '1014',
                SINGER: '100',
                ALBUM: '10',
                SONGLIST: '1000',
                RADIO: '1009',
                USER: '1002',
                LYRIC: '1006'
            }
            
        }
    },
    methods:{
        resetSearchData(type){
            //   '1', '1014','100', '10','1000', '1009',  '1002'
            // '单曲','视频','歌手','专辑','歌单','主播电台','用户'
            switch (type) {
                case "1":
                    this.singleSongObj.singleSongList = []
                    this.singleSongObj.singleSongLength = 0
                    break
                case "1014":
                    this.videoObj.videoList = []
                    this.videoObj.videoLength = 0
                    break
                case "100":
                    this.singerObj.singerList = []
                    this.singerObj.singerLength = 0
                    break
                default:
                    this.singleSongObj.singleSongList = []
                    this.singleSongObj.singleSongLength = 0
                    this.videoObj.videoList = []
                    this.videoObj.videoLength = 0
                    this.singerObj.singerList = []
                    this.singerObj.singerLength = 0
                    break
            }
        },
        searchRes(keyword){
            //原因：input事件为高频繁触发事件，会不经意增加向服务器请求的次数 解决：延时请求
            if(this.timer){
                this.resetSearchData()
                clearTimeout(this.timer);
            }
            if(keyword){
                this.isHotSearch = false;
                this.timer = setTimeout(() => {
                    this.handleSearchResult(keyword,this.searchActive,20)
                }, 400)
            }
        },
        handleGobackAction(){
            this.$router.go(-1)
        },
        //标志特定关键字
        handleMarkKeyWord(kw,data){
            let markReg = new RegExp(kw,"g")
            data = JSON.stringify(data).replace(markReg,"<span style='color:#23b4f6;'>"+kw+"</span>")
            return JSON.parse(data)
        },
        //读取过滤器 data要过滤的数据 datatype相对应的过滤器 classify具体的字段分类
        handleFilterData(data,datatype,classify){
            // 歌曲过滤器
            if(datatype==="music"){
                switch (classify) {
                    //歌曲描述：显示
                    case "songDescribe":
                        return filterSongDescribe(data)
                        break
                    //歌曲时长：获取,格式
                    case "songLength":
                        return filterSongLength(data)
                        break
                    default:
                        break
                }
            // 视频过滤器
            }else if(datatype==="video"){
                switch (classify) {
                    //视频播放次数：格式
                    case "videoPlayTime":
                        return filterVideoPlayTime(data)
                        break
                    //视频上传者：显示
                    case "videoCreator":
                        return fliterVideoCreator(data)
                        break
                    //视频播放时长：格式
                    case "videoLength":
                        return filterVideoLength(data)
                        break
                    default:
                        break
                }
            }
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
            return `http://music.163.com/song/media/outer/url?id=${this.singleSongObj.singleSongList[currentIndex].songId}.mp3`
        },
        addSongList(currentIndex){
            let isExist = false
            this.$store.state.song.playList.map(item=>{
                if(item.songId === this.singleSongObj.singleSongList[currentIndex].songId){
                    isExist = true
                }
            })
            if(!isExist){
                this.$store.dispatch('song/modifyPlayList',this.singleSongObj.singleSongList[currentIndex])
            }
            this.$store.dispatch('song/modifyCurrentSong',this.singleSongObj.singleSongList[currentIndex].songId)
            bus.emit('playSong','')
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
                getNetEaseMusicCheckCopyright(this.singleSongObj.singleSongList[currentIndex].songId).then(res=>{
                    if(res.message==='ok'){
                        resolve(res.success)
                    }
                })
            }))
        },
        //获取指定歌曲基本信息
        ajaxUrlAsyn(currentIndex){
            return new Promise(resolve=>{
                getNetEaseMusicUrl(this.singleSongObj.singleSongList[currentIndex].songId).then(res=>{
                    if (res) {
                        this.singleSongObj.singleSongList[currentIndex].songInfo = res
                        resolve()
                    }
                    
                })
            })
        },
        //获取指定歌曲属性信息
        ajaxAlbumPicAsyn(currentIndex){
            return new Promise(resolve=>{
                getNetEaseMusicAlbum(this.singleSongObj.singleSongList[currentIndex].alibumId).then(res=>{
                    if (res) {
                        this.singleSongObj.singleSongList[currentIndex].picUrl = res.album.picUrl
                        this.singleSongObj.singleSongList[currentIndex].songLength = this.handleFilterData(res.songsInfo[0].dt,"music","songLength")
                        resolve()
                    }
                })
            })
        },
        //获取指定歌曲的歌词
        ajaxLyricAsyn(currentIndex){
            return new Promise(resolve=>{
                getNetEaseMusicLyric(this.singleSongObj.singleSongList[currentIndex].songId).then(res=>{
                    if (res) {
                        this.singleSongObj.singleSongList[currentIndex].lrc = !res.nolyric?res.lyric:''
                        resolve()
                    }
                })
            })
        },
        // 单曲更多按钮事件
        moreAction(currentIndex){
            if (!this.isMoreFlag) {
                this.downLoadIndex = currentIndex
                this.isMoreFlag = true
                this.isAjaxData = false
            }
        },
        searchAction(searchType){
            let isRequest = false
            this.searchActive = searchType
            switch (searchType) {
                case "1":
                    if(this.singleSongObj.singleSongLength===0) isRequest = true
                    break
                case "1014":
                    if(this.videoObj.videoLength===0) isRequest = true
                    break
                case "100":
                    if(this.singerObj.singerLength===0) isRequest = true
                    break
                case "10":
                    if(this.albumObj.albumLength===0) isRequest = true
                    break
                default:
                    break
            }
            if(isRequest&&this.searchWord!==""){
                this.handleSearchResult(this.searchWord,searchType,20)
            }else if(isRequest&&this.searchWord===""){
                // todo...推荐搜索
                // this.handleSearchResult(this.recommendSearch,searchType,20)
            }
        },
        handleSearchResult(kw,type,limit,offset){
            //   '1', '1014','100', '10','1000', '1009',  '1002'
            // '单曲','视频','歌手','专辑','歌单','主播电台','用户'
            getNetEaseMusicSearch(kw,type,limit,offset).then(res=>{
                if (res) {
                    if(type==="1"){
                        this.singleSongObj.singleSongList = this.handleMarkKeyWord(kw,res.songData)
                        this.singleSongObj.singleSongLength = res.songCount
                    }else if (type==="1014") {
                        this.videoObj.videoList = this.handleMarkKeyWord(kw,res.videoData)
                        this.videoObj.videoLength = res.videoCount
                    }else if (type==="100"){
                        this.singerObj.singerList = res.singerData
                        this.singerObj.singerLength = res.singerCount
                    }else if (type==="10"){
                        this.albumObj.albumList = res.albumData
                        this.albumObj.albumLength = res.albumCount
                        // console.log(this.albumObj)
                    }
                    
                }
            })
            
        }
    },
    mounted() {
        getNetEaseMusicHotSearch().then(res=>{
            this.hotSearchList = res
        })
    }
}
</script>

<style scoped>
.list{
    width: 53.333333rem;
    height: 1.333333rem;
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
.searchBar>>>.mint-search-list{
    display: block !important;
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
.songCell>>>.mint-cell-wrapper{
    background: transparent;
    box-sizing: content-box;
    padding: .08rem 0;
    border-bottom: 1px solid #cccccc;
}
.songCell>>>.mint-cell-value{
    display: block;
    width: 100%;
    height: 100%;
}
.songCell .songInfo{
    position: relative;
    float: left;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-left: .266667rem;
}
.songCell .songTitle{
    width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000;
}
.songCell .singer{
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: .32rem;
    margin-top: .16rem;
}
.songCell .more{
    position: absolute;
    top: 12%;
    right: 0;
    font-size: .693333rem;
    transform: rotate(90deg);
}
.videoCell>>>.mint-cell-value{
    display: block;
    float: left;
}
.videoCell>>>.mint-cell-title{
    position: relative;
    flex: 0;
}
.videoCell .videoTitle{
    padding-left: .266667rem;
    font-size: .373333rem;
    line-height: .533333rem;
    color: #000;
}
.videoCell .videoInfo{
    padding-left: .266667rem;
    font-size: .293333rem;
    margin-top: .266667rem;
}
.videoCell .mint-cell img{
    padding-top: .133333rem;
}
.playTime{
    position: absolute;
    top: .133333rem;
    right: .133333rem;
}
.playTime .playIcon{
    font-size: .213333rem;
    color: #fff;
    font-weight: bold;
}
.playTime .playNum{
    font-size: .213333rem;
    color: #fff;
}
.singerCell>>>.mint-cell-wrapper{
    padding: 0 .133333rem;
    line-height: 1.28rem;
}
.singerCell>>>.mint-cell-title{
    margin: .08rem 0;
}
.singerCell .cover{
    float: left;
    width: 1.333333rem;
    height: 1.2rem;
    border-radius: .133333rem;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin-bottom: .08rem;
}
.singerCell .singerName{
    float: left;
    font-size: .346667rem;
    margin-left: .266667rem;
}
.singerCell .enter{
    margin-right: .533333rem;
}
.enter .userIcon{
    position: relative;
    top: 0.053333rem;
    font-size: .426667rem;
    margin-right: .133333rem;
}
.enter .enterText{
    font-size: .32rem;
    color: #c2bbbb;
    font-weight: bold;
}
</style>
