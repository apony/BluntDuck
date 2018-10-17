import API from '@api'
import axios from '@utils/axios.js'
/**
 * @description 获得图书详情
 * @author apony
 * @date 2018-09-14
 * @augments paramObj 参数对象
 * @param {*} kw 关键词 二选其一 必填
 * @param {*} catid 图书id 二选其一 必填
 * @param {*} pageToken 翻页值 选填
 */
export function getBangumiBookDetail(paramObj){
    return new Promise(resolve=>{
        axios.get(API.BANGUMI_BOOK_DETAIL_URL,{
            kw:paramObj.kw,
            catid:paramObj.catid,
            pageToken:paramObj.pageToken
        })
        .then(result=>{
            // let data = 
            // resolve(data)
        })
        .catch(error=>{
            console.log('失败');
            console.log(error);
        })
    })
}

/**
 * @description 获得搜索音乐结果
 * @author apony
 * @date 2018-10-10
 * @param {*} keywords 关键词 必填
 */
export function getNetEaseMusicSearch(keywords){
    return new Promise(resolve=>{
        axios.get(API.NETEASE_MUSIC_SEARCH_URL,{
            keywords
        })
        .then(result=>{
            if(result.status===200){
                let data = result.data.result.songs.map(item=>{
                    return {
                        songId: item.id,
                        songName: item.name,
                        albumDescribe: item.album.name,
                        alibumId: item.album.id,
                        singer: item.artists.map(childItem=>{
                            return {
                                singerId: childItem.id,
                                singerName: childItem.name
                            }
                        }),
                        songInfo:[]
                    }
                })
                resolve(data)
            }
        })
        .catch(error=>{
            console.log('失败');
            console.log(error);
        })
    })
}

/**
 * @description 获取音乐url地址
 * @author apony
 * @date 2018-10-10
 * @param {*} id 歌曲id 必填
 */
export function getNetEaseMusicUrl(id){
    return new Promise(resolve=>{
        axios.get(API.NETEASE_MUSIC_URL_URL,{
            id
        })
        .then(result=>{
            if(result.status===200){
                let data = result.data.data.map(item=>{
                    return {
                        id: item.id,
                        size: item.size,
                        // url: item.url,
                        //url链接取用官方稳定外链链接,网易云服务器缓存链接有时间限制
                        url: `http://music.163.com/song/media/outer/url?id=${id}.mp3`,
                        type: item.type
                    }
                })
                resolve(data)
            }
        })
        .catch(error=>{
            console.log('失败');
            console.log(error);
        })
    })
}

/**
 * @description 查看该音乐版权
 * @author apony
 * @date 2018-10-10
 * @param {*} id 歌曲id 必填
 */
export function getNetEaseMusicCheckCopyright(id){
    return new Promise(resolve=>{
        axios.get(API.NETEASE_MUSIC_CHECKCOPY_URL,{
            id
        })
        .then(result=>{
            if(result.status===200){
                let data = result.data
                resolve(data)
            }
        })
        .catch(error=>{
            console.log('失败');
            console.log(error);
        })
    })
    
}

/**
 * @description 获得热门搜索
 * @author apony
 * @date 2018-10-13
 */
export function getNetEaseMusicHotSearch(){
    return new Promise(resolve=>{
        axios.get(API.NETEASE_MUSIC_HOTSEARCH_URL)
        .then(result=>{
            if(result.status===200){
                let data = result.data.result.hots
                resolve(data)
            }
        })
        .catch(error=>{
            console.log('失败');
            console.log(error);
        })
    })
    
}

/**
 * @description 获得专辑内容
 * @author apony
 * @date 2018-10-16
 * @param {*} id 专辑id 必填
 */
export function getNetEaseMusicAlbum(id){
    return new Promise(resolve=>{
        axios.get(API.NETEASE_MUSIC_ALBUM_URL,{
            id
        })
        .then(result=>{
            if(result.status===200){
                let data = result.data.album
                resolve(data)
            }
        })
        .catch(error=>{
            console.log('失败');
            console.log(error);
        })
    })
    
}

/**
 * @description 获得歌词
 * @author apony
 * @date 2018-10-16
 * @param {*} id 歌曲id 必填
 */
export function getNetEaseMusicLyric(id){
    return new Promise(resolve=>{
        axios.get(API.NETEASE_MUSIC_LYRIC_URL,{
            id
        })
        .then(result=>{
            if(result.status===200){
                let data = result.data.lrc
                resolve(data)
            }
        })
        .catch(error=>{
            console.log('失败');
            console.log(error);
        })
    })
    
}