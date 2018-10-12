import Vue from 'vue'
import Router from 'vue-router'
import Article from '../pages/article'
import Game from '../pages/game'
import Book from '../pages/book'
import Music from '../pages/music'
import Search from '../pages/music/com/search.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/article',
      name: 'article',
      component: Article,
      alias:'/'
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
    },
    {
      path: '/book',
      name: 'book',
      component: Book
    },
    {
      path: '/music',
      name: 'music',
      component: Music,
      children:[
        {
          path: 'search',
          name: 'search',
          component: Search
        }
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
