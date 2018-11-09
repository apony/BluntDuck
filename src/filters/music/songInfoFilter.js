//过滤搜索时歌手名显示
export function filterSongDescribe(songInfo) {
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

//过滤歌曲播放时长
export function filterSongLength(timeStamp) {
    // let hours = parseInt(timeStamp / (1000 * 60 * 60))
    let minutes = parseInt((timeStamp % (1000 * 60 * 60)) / (1000 * 60))
  	let seconds = parseInt(timeStamp % (1000 * 60) / 1000)
    minutes = minutes<10? "0"+minutes: ""+minutes
    seconds = seconds<10? "0"+seconds: ""+seconds
    return minutes + ":" + seconds
}