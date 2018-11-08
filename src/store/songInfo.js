export default {
    namespaced: true,
    state: {
        currentSongPoint: 0,
        playList: JSON.parse(sessionStorage.getItem('songList'))||[]
    },
    mutations: {
        toggleSong(state,params){
            state.playList.map((item,index)=>{
                if(item.songId===params){
                    state.currentSongPoint = index
                }
            })
        },
        addPlayList(state,params){
            state.playList.push(params)
            let songList = JSON.parse(sessionStorage.getItem('songList'))
            songList.push(params)
            sessionStorage.setItem('songList',JSON.stringify(songList))
        }
    },
    actions: {
        modifyCurrentSong(context,params){
            context.commit('toggleSong',params)
        },
        modifyPlayList(context,params){
            context.commit('addPlayList',params)
        }
    }
}
  