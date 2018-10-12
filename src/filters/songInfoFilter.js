//过滤搜索时歌手名显示
export function filterDescribe(songInfo) {
    let singerStr = ''
    songInfo.singer.map((item,index)=>{
        singerStr +=item.singerName
        if(songInfo.singer.length-1!==index){
            singerStr += ' | '
        }
    })
    singerStr += ` - ${songInfo.albumDescribe}`
    return singerStr
}
//过滤搜索时音乐标题过长
export function filterSongName(name) {
    if(name.length>=20){
        return name.substring(0,20) + '...'
    }else{
        return name
    }
}