<template>
    <div>
        <router-view></router-view>
        <app-nav />
    </div>
  
</template>

<script>
import AppNav from './common/AppNav.vue'
import {getBangumiBook} from './services'
export default {
    components: {
        AppNav
    }
}
</script>

