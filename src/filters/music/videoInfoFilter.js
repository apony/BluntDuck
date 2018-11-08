//过滤视频总播放次数
export function filterVideoPlayTime(playTime) {
    return parseInt(playTime)/10000 + "万"
}
//过滤视频上传者
export function fliterVideoCreator(nameArr) {
    let result = ""
    nameArr.map((item,index)=>{
        result += item.userName
        if(index!==nameArr.length-1){
            result += " | "
        }
    })
    return " by "+ result
}
//过滤视频播放时长
export function filterVideoLength(timeStamp) {
    // let hours = parseInt(timeStamp / (1000 * 60 * 60))
    let minutes = parseInt((timeStamp % (1000 * 60 * 60)) / (1000 * 60))
  	let seconds = parseInt(timeStamp % (1000 * 60) / 1000)
    minutes = minutes<10? "0"+minutes: ""+minutes
    seconds = seconds<10? "0"+seconds: ""+seconds
    return "<span style='color:red'>"+minutes + ":" + seconds+"<span>"
}