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
//过滤歌曲时间
export function filterSongLength(timeStamp) {
    let songTime = {}
    songTime.hours = parseInt(timeStamp / (1000 * 60 * 60))+''
  	songTime.minutes = parseInt((timeStamp % (1000 * 60 * 60)) / (1000 * 60))+''
  	songTime.seconds = parseInt(timeStamp % (1000 * 60) / 1000)+''
    songTime.milliSeconds = parseInt(timeStamp - songTime.hours*3600000 + songTime.minutes*60000)+''
    return songTime
}