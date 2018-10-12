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
*/
const NETEASE_MUSIC_SEARCH_URL = '/search'

/*
    NETEASE音乐url地址的请求接口
    参数：
        必填：String:id 歌曲id
*/
const NETEASE_MUSIC_URL_URL = '/music/url'

/*
    NETEASE查看音乐版权的请求接口
    参数：
        必填：String:id 歌曲id
*/
const NETEASE_MUSIC_CHECKCOPY_URL = '/check/music'

export default {
    BANGUMI_BOOK_DETAIL_URL,
    NETEASE_MUSIC_SEARCH_URL,
    NETEASE_MUSIC_URL_URL,
    NETEASE_MUSIC_CHECKCOPY_URL
}