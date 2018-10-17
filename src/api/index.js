/*
    BANGUMI图书的请求接口
    参数：
        必填：String:kw 关键词  String:catid 书的id 二选一
        选填：String:pageToken 翻页值
*/
const BANGUMI_BOOK_DETAIL_URL = '/book/bangumi'

/*
    NETEASE搜索音乐的请求接口
    参数：
        必填：String:keywords 关键词
        选填：Number:limit返回数量 Number:offset 偏移量 String:type 搜索类型
*/
const NETEASE_MUSIC_SEARCH_URL = '/search'

/*
    NETEASE热门搜索的请求接口
    参数：
        必填：无
*/
const NETEASE_MUSIC_HOTSEARCH_URL = '/search/hot'

/*
    NETEASE音乐url地址的请求接口
    参数：
        必填：String:id 歌曲id
*/
const NETEASE_MUSIC_URL_URL = '/song/url'

/*
    NETEASE查看音乐版权的请求接口
    参数：
        必填：String:id 歌曲id
*/
const NETEASE_MUSIC_CHECKCOPY_URL = '/check/music'

/*
    NETEASE获取专辑内容的请求接口
    参数：
        必填：String:id 专辑id
*/
const NETEASE_MUSIC_ALBUM_URL = '/album'

/*
    NETEASE获取歌词的请求接口
    参数：
        必填：String:id 歌曲id
*/
const NETEASE_MUSIC_LYRIC_URL = '/lyric'

export default {
    BANGUMI_BOOK_DETAIL_URL,
    NETEASE_MUSIC_SEARCH_URL,
    NETEASE_MUSIC_HOTSEARCH_URL,
    NETEASE_MUSIC_ALBUM_URL,
    NETEASE_MUSIC_URL_URL,
    NETEASE_MUSIC_CHECKCOPY_URL,
    NETEASE_MUSIC_LYRIC_URL
}