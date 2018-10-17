<template>
    <div>
        <mt-search  placeholder="搜索"  v-model="searchWord" @input="searchRes">
            <mt-cell
                v-for="(item,index) in searchList"
                :key="index"
                :title="handleTitleData(item.songName)"
                :label="handleDescribeData(item)"
                @click.native="playSong(index)"
                >
                <span class="more">...</span>
            </mt-cell>
            
        </mt-search>
        <div class="gobackbtn" @click="handleGobackAction"><</div>
        <div class="content" v-show="isSearch">
            <div class="title">热门搜索</div>
            <ul class="hotList">
                <li v-for="(item,index) in hotSearchList" :key="index" @click="handleHotSearchAction(index)">{{item.first}}</li>
            </ul>
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
    filterSongName
} from '@filters/songInfoFilter.js'
import bus from '@utils/pubsub.js'
export default {
    data(){
        return{
            value:'',
            isSearch: true,
            searchList: [],
            hotSearchList:[],
            searchWord:''
        }
    },
    methods:{
        searchRes(keyword){
            //原因：input事件为高频繁触发事件，会不经意增加向服务器请求的次数 解决：延时请求
            if(this.timer){
                this.searchList = []
                clearTimeout(this.timer);
            }
            if(keyword){
                this.timer = setTimeout(() => {
                    this.isSearch = false;
                    getNetEaseMusicSearch(keyword).then(res=>{
                        if (res) {
                            this.searchList = res
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
        playSong(index){
            let pm = new Promise((resolve=>{
                getNetEaseMusicCheckCopyright(this.searchList[index].songId).then(res=>{
                    if(res.message==='ok'){
                        resolve(res.success)
                    }
                })
            }))
            //链式promise结构解决多个异步按顺序响应数据
            pm.then((isCopyright)=>{
                if (isCopyright) {
                    return this.ajaxLyricAsyn(index)
                }
                else{
                    console.log('当前歌曲没有版权!')
                }
            })
            .then(()=>{
                return this.ajaxUrlAsyn(index)
            })
            .then(()=>{
                return this.ajaxAlbumPicAsyn(index)
            })
            .then(()=>{
                bus.emit('addSong',this.searchList[index])
            })
            
        },
        ajaxUrlAsyn(index){
            return new Promise(resolve=>{
                getNetEaseMusicUrl(this.searchList[index].songId).then(res=>{
                    if (res) {
                        this.searchList[index].songInfo = res
                        resolve()
                    }
                    
                })
            })
        },
        ajaxAlbumPicAsyn(index){
            return new Promise(resolve=>{
                getNetEaseMusicAlbum(this.searchList[index].alibumId).then(res=>{
                    if (res) {
                        this.searchList[index].picUrl = res.picUrl
                        resolve()
                        
                    }
                })
            })
        },
        ajaxLyricAsyn(index){
            return new Promise(resolve=>{
                getNetEaseMusicLyric(this.searchList[index].songId).then(res=>{
                    if (res) {
                        this.searchList[index].lrc = res.lyric
                        resolve()
                        
                    }
                })
            })
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
.mint-search>>>.mint-cell-text{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: nowrap;
}
.mint-search>>>.mint-cell-wrapper{
    margin-top: .213333rem;
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
