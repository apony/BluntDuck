/*
    图书的请求接口
    参数：
        必填：String:kw 关键字  String:catid 书的id 二选一
        选填：String:pageToken 翻页值
*/
const BANGUMI_BOOK_URL = '/book/bangumi'

export default {
    BANGUMI_BOOK_URL,
}