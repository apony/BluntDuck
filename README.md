# 个人成长的vue笔记项目——laya
#####基于vue-cli脚手架工具搭建的vue环境，使用node的express模块模拟后台mock数据
------
## Project setup(项目配置)
### Install depend on the package (安装依赖包)
```node
npm install
```
### Running the express server(运行express服务器)
```node
npm run start
```
### Compiles and hot-reloads for development(开发环境)
```node
npm run dev
```
### Compiles and minifies for production(项目部署)
```node
npm run build
```
------
## Project Path(项目路径文件)
* `root_path：`
    *  config：代理模式(测试中)
    *  vue.config.js：服务器代理转发(测试中)
    *  node_modules：存放node内置及外置模块(包括webpack，vue等)
    *  package.json：node模块的配置文件(dependencies：-S生产依赖 devDependencies：-D开发依赖(工具))
    *  server.js：express服务器配置
    *  node_router：node后台路径拦截路由(返回mock数据)
    *  otherFile：vue-cli搭建环境的基本配置文件
* `src_path：`
    *  api：管理接口文档
    *  boundle：存放封装插件
    *  common：存放公共组件的目录
    *  pages：存放各模块组件的目录
    *  mock：存放mock数据的目录
    *  router：vue跳转路由表
    *  services：存放筛选后台返回数据(封装Promise)
    *  static：存放静态文件的目录(包括img/js/css)
    *  store：存放项目全局状态数据
    *  filter：存放转换前端显示与后台返回数据不一致的的数据(后台：时间戳 前端显示：年月日)
    *  utils：存放项目工具类的目录
    *  App.vue：项目主界面
    *  main.js：项目入口文件

------
## Project construction details(项目搭建细节)
* 1.搭建服务器
    * 采取了express服务器，因为它快捷。
        * a. node支持部分ES6语法，恰好import export语法不支持，只能使用commonJS规范。
        * b. app.listen方法没有设置域名，导致server.address().address为空
    * 从网友封装的vue.config.js到webpack自带的中间件http-proxy-middleware进行服务器代理
        * vue.config.js  详情请移步=>[传送门](http://vuejs-templates.github.io/webpack)
    > * baseUrl 根目录
    > * outputDir 输出打包文件目录
    > * devServer 服务代理及分发请求处理
    > * testing...(测试中，暂未可以拦截请求)

        * http-proxy-middleware(node_modules=>webpack-dev-server=>lib=>Server.js)
    ```js
    /*webpack只拦截前缀为/api的接口*/
    app.use('/api',httpProxyMiddleware({
        target:'protocol://host:port',
        changeOrigin:true
    }))
    ```
        * node_router=>index.js(express.Router()设置路由表)
    * 代理到别人的服务器细节
        * 自己自定义的拦截请求(本项目为'/api')需要复写成为空，原因是因为别人的服务器定义的接口没有/api的路径
        
        ```js
        app.use('/api',httpProxyMiddleware({
            target:'http://api01.bitspaceman.com:8000',
            changeOrigin:true,
            pathRewrite: {
            '^/api/' : '',     // rewrite intercept path to null
            },
        }))
        ```
* 2.资源路径问题
    * 今天踩坑无数，翻阅无数资料。总结：public文件夹千万不能动！不能动！不能动！
        * a. vue-cli 3.x创建项目下来，我立刻把public文件夹修改成自己最喜欢的static文件夹，然后血案就发生了。。。

        ```html
        //index.html引入的标签全线奔溃，link，title等标签声明形同虚设！
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="<%= BASE_URL %>font/iconfont.css" />
        <title>laya_music</title>
        //划重点：vue-cli 3.x把打包方式改为public文件夹=>dist文件夹
        ```
        * b. 设置ico图标时，在前面加上"./"
        ```html
        <link rel="icon" type="image/x-icon" href="./<%= BASE_URL %>favicon.ico" />
        ```
        * c. `<%= BASE_URL %>`为public文件夹的根路径
        
------
## Project code details(项目代码细节)
* 1.关于class绑定的问题 详情请移步=>[官网传送门](https://cn.vuejs.org/v2/guide/class-and-style.html#ad)
    * 用法：
    >* template => :class="{ active: isActive, 'text-danger': hasError }
    >* script => data(){return{{isActive: true, hasError: false}}}
    >* result => `<div class="static active"></div>`

    * 场景：底部导航栏需要默认选中，然后点击需要切换选中状态
    * 解决：设置一个状态值绑定到:class中，其中状态值为是否选中的类名，然后点击item时通过index改变该状态的数据为'select'即可
    ```vue
    <template>
    <nav>
        <ul>
            <li v-for="(item,index) in itemImage" 
                :key="index" class="app-item ac" @click="iconSelect"
                <!-- 根据index来判断是否选中 -->
                :class="{[item]:true,[item_hover[index]]:true}">
            </li>
        </ul>
    </nav>
    </template>
    <script>
    export default {
    data(){
        return{
            itemImage:['icon-yuedu','icon-youxi','icon-tushu','icon-music'],
            item_hover:['select','','','']
        }
    },
    methods:{
        iconSelect(){

        }
    }
    }
    </script>
    <style scoped>
    .select{
        color: #f09199;
    }
    </style>
    ```
    * 笔记：:class="key:value" key为显示的class名称，value是否取用。此外key取变量时需加上[]加以区分，与中文key同理
* 2.关于vue对复杂数据类型(Object,Array)的数据检测问题 详情请移步=>[官网传送门](https://cn.vuejs.org/v2/guide/list.html#%E6%95%B0%E7%BB%84%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B)
    * 用法：
        * 使用变异方法更新数组(对象可以使用使用Vue.set/vm.$set和Object.assign方法来更新对象)
        
        > * push()
        > * pop()
        > * shift()
        > * unshift()
        > * splice() => 集攻击(增)防御(删)逃跑(改)于一身的贼厉害的方法【已推荐√】
        > * sort()
        > * reverse()
        
        * 对于非变异方法使用替换旧数组打法来更新数组
        ```js
        arr.items = arr.items.filter(item=>{
            if(item%2==0) return
        })
        ```
    * 场景：底部导航栏需要默认选中，然后点击需要切换选中状态
    * 解决：由于要通过index修改数组的item项，使用splice方法进行更改select和''两个状态的切换
    ```vue
    <script>
    iconSelect(i){
        this.item_hover.map((item,index)=>{
            if(item=="select"){
                this.item_hover.splice(index,1,'')
                return
            }
        })
        this.item_hover.splice(i,1,'select')
    }
    </script>
    ```
    * 笔记：记住复杂数据类型普通修改不会触发Observer监测器(对象使用构建新对象，数组则使用变异方法或者替换旧数组)
