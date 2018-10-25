export default {
    namespaced: true,
    state: {
        currentSongPoint: 0,
        playList: JSON.parse(sessionStorage.getItem('songList'))||[]
    },
    mutations: {
        setCurrentSong(state,params){
            state.currentSongPoint = params
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
            context.commit('setCurrentSong',params)
        },
        modifyPlayList(context,params){
            context.commit('addPlayList',params)
        }
    }
}
  