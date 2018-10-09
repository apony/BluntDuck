<template>
    <div>
        <keep-alive>
            <router-view />
        </keep-alive>
        <app-nav />
    </div>
  
</template>

<script>
import AppNav from './common/AppNav.vue'
export default {
    components: {
        AppNav
    },
    data(){
        return{
            
        }
    },
    mounted(){
        
    }
}
</script>

