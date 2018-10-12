<template>
    <div class="musicBox">
        <mt-search  placeholder="搜索" @input="searchRes">
            <mt-cell
                v-for="(item,index) in searchList"
                :key="index"
                :title="handleTitleData(item.songName)"
                :label="handleDescribeData(item)"
                @click.native="test(index)"
                >
                <span class="more">...</span>
            </mt-cell>
            
        </mt-search>
        <div class="gobackbtn" @click="handleGobackAction"><</div>
        
    </div>
</template>

<script>
import {
    getNetEaseMusicSearch,
    getNetEaseMusicUrl,
    getNetEaseMusicCheckCopyright
} from '@services'
import {
    filterDescribe,
    filterSongName
} from '@filters/songInfoFilter.js'
export default {
    data(){
        return{
            value:'',
            searchList: []
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
                    getNetEaseMusicSearch(keyword).then(data=>{
                        this.searchList = data
                    })
                }, 400)
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
        test(index){
            console.log('播放')
        }
    }
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
.mint-search>>>.mint-search-list{
    margin-top: .213333rem;
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

</style>
