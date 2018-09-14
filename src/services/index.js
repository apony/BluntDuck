import API from '../api'
import axios from '../utils/axios'
/**
 * @description 获得图书详情
 * @author apony
 * @date 2018-09-14
 * @augments paramObj 参数对象
 * @export
 * @param {*} kw 二选其一 必填
 * @param {*} catid 二选其一 必填
 * @param {*} pageToken 翻页值 选填
 */
export function getBangumiBook(paramObj){
    return axios.get(API.BANGUMI_BOOK_URL,{
        kw:paramObj.kw,
        catid:paramObj.catid,
        pageToken:paramObj.pageToken
    })
}
