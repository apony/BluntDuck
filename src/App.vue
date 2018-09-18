<template>
    <div>
        <app-header />
        <router-view></router-view>
        <app-nav />
    </div>
  
</template>

<script>
import AppNav from './common/AppNav.vue'
import AppHeader from './common/AppHeader.vue'
import {getBangumiBook} from './services'
export default {
    components: {
        AppHeader,
        AppNav
    }
}
</script>

