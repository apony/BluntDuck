import axios from '@utils/axios.js'
/**
 * @description mock: 获得初始化歌曲
 * @author apony
 * @date 2018-10-25
 */
export function getInitSong(){
    return new Promise(resolve=>{
        axios.get('/initSong')
        .then(result=>{
            if(result.status===200){
                let data = result.data.data[0]
                resolve(data)
            }
        })
        .catch(error=>{
            console.log('失败');
            console.log(error);
        })
    })
    
}