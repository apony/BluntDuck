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
    * 用法(多个:class显示控制时用key-val)：
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
                :key="index" class="app-item ac"
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
    }
    </script>
    <style scoped>
    .select{
        color: #f09199;
    }
    </style>
    ```
    * 笔记：:class="key:value" key为显示的class名称，value是否取用。此外key取变量时需加上[]加以区分，与中文key同理
    
----
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
    
----
* 3.关于淘宝移动端适配方案flexible.js适配问题 详情请移步=>[传送门1](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html) [传送门2](http://yunkus.com/mobile-adaptation-scheme-flexiblejs) 
    * 简述：手淘开发团队经过多年的摸索和实战，总结了一套移动端适配的方案——flexible方案。(lib-flexible)
    * 安装：
        * 线上引入(加载阿里CDN的文件)

        ```html
        <script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
        ```
        * 下载引入 [传送门](https://download.csdn.net/download/pojava/10674317) (下载注意：flexible_css.js内含reset.css)
        ```html
        //引入flexible.js和flexible_css.js
        <script src="......lib-flexible/flexible.js"></script>
        <script src="......lib-flexible/flexible_css.js"></script>
        ```
    * 转换：简单来说，Flexible会将视觉稿分成100份（主要为了以后能更好的兼容vh和vw），而每一份被称为一个单位a。同时1rem单位被认定为10a
        这时我们假设设计稿为750px，解得
        > 1a   = 7.5px
        > 1a   = 0.1rem
        > 1rem = 75px
    * 转换方式：(cssrem+IDE，Sass/Less函数和混合宏，PostCSS)
        * cssrem => `Visual Studio Code`
            * 1.在插件商店下载cssrem插件并安装(cssrem是一个把px单位自动转换为rem单位的插件)
            * 2.文件-首选项-设置-搜索cssrem，配置用户参数(行号旁边的小铅笔可以修改用户参数)

            ```vscodeConfig
            // 自动移除0开头的前缀，默认：true
            "cssrem.autoRemovePrefixZero": true,
            // 根元素的字体大小 (unit: px), default: 16 (假设设计稿为375px，这里我们设置为3.75 iPhone6/7/8的rem基准值)
            "cssrem.rootFontSize": 3.75, 
            //使插件的代码提示提前
            "editor.snippetSuggestions": "inline" => "top"
            ```
        * cssrem => `SublimeText`
            * 下载cssrem插件  [传送门](https://github.com/flashlizi/cssrem)
            * 进入packages目录：Sublime Text -> Preferences -> Browse Packages...
            * 复制下载的cssrem目录到刚才的packges目录里。重启Sublime Text。
            * 参数配置：Sublime Text -> Preferences -> Package Settings -> cssrem
            
            ```
            px_to_rem - px转rem的单位比例，默认为40。
            max_rem_fraction_length - px转rem的小数部分的最大长度。默认为6。
            available_file_types - 启用此插件的文件类型。默认为：[".css", ".less", ".sass"]
            ```
        * flexible+Sass函数
        ```sass
        @function px2em($px, $base-font-size: 16px) {
            <a href='http://www.jobbole.com/members/jinyi7016'>@if</a> (unitless($px)) {
                @warn "Assuming #{$px} to be in pixels, attempting to convert it into pixels for you";
                @return px2em($px + 0px); // That may fail.
            } @else if (unit($px) == em) {
                @return $px;
            }
            @return ($px / $base-font-size) * 1em;
        }
        ```
        * flexible+Sass混合宏

            ```sass
            @mixin px2rem($property,$px-values,$baseline-px:16px,$support-for-ie:false){
                //Conver the baseline into rems
                $baseline-rem: $baseline-px / 1rem * 1;
                //Print the first line in pixel values
                <a href='http://www.jobbole.com/members/jinyi7016'>@if</a> $support-for-ie {
                    #{$property}: $px-values;
                }
                //if there is only one (numeric) value, return the property/value line for it.
                <a href='http://www.jobbole.com/members/jinyi7016'>
                @if</a> type-of($px-values) == "number"{
                    #{$property}: $px-values / $baseline-rem;
                }
                @else {
                    //Create an empty list that we can dump values into
                    $rem-values:();
                    @each $value in $px-values{
                        // If the value is zero or not a number, return it
                        <a href='http://www.jobbole.com/members/jinyi7016'>@if</a> $value == 0 or type-of($value) != "number"{
                            $rem-values: append($rem-values, $value / $baseline-rem);
                        }
                    }
                    // Return the property and its list of converted values
                    #{$property}: $rem-values;
                }
            }
            ```
        * flexible+PostCSS(px2rem)
            支持`node`、gulp、`webpack`、Grunt => [传送门](https://www.npmjs.com/package/postcss-px2rem)
            PostCSS语法：(不用计算怎么转换成rem，后面解析css样式只需加上/*px*/或者/*no*/不解析)
            
            ```postCSS
            .selector {
                width: 150px;
                height: 64px; /*px*/
                font-size: 28px; /*px*/
                border: 1px solid #ddd; /*no*/
            }
            .selector {
                width: 2rem;
                border: 1px solid #ddd;
            }
            [data-dpr="1"] .selector {
                height: 32px;
                font-size: 14px;
            }
            [data-dpr="2"] .selector {
                height: 64px;
                font-size: 28px;
            }
            [data-dpr="3"] .selector {
                height: 96px;
                font-size: 42px;
            }
            ```  

----
* 4.vue2.x到vue3.x爬坑之路
    * 1.vue封装自定义插件库boundle
        * 原理：利用Vue.use方法会触发内部的install方法并传入Vue对象到方法中
        * 场景：由于业务需要用到，基于vue的移动组件库mint-ui，考虑到性能所以采取按需引入mint-ui
        * 过程：
            > 下载mint-ui

            ```npm
            npm i mint-ui -S
            ```
            > main.js片段

            ```js
            import Vue from 'vue'
            import boundle from './boundle'
            Vue.use(boundle)
            ```
            > index.js片段(boundle文件夹下的index.js)
            
            ```js
            //按需引入mint-ui的组件模块
            import { Header } from 'mint-ui'
            export default {
                install:function(Vue) {
                    Vue.component(Header.name, Header);
                }
            }
            ```
        * 报错： [传送门](https://segmentfault.com/a/1190000006435886)
        ```console
        [Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build
        //运行时构建不包含模板编译器，因此不支持 template 选项，只能用 render 选项，但即使使用运行时构建，在单文件组件中也依然可以写模板，因为单文件组件的模板会在构建时预编译为 render 函数。
        ```
        * 解答：
        
        >原来webpack的别名功能把vue/dist/vue.js命名成了vue，所以引入vue的时候只需
        
        ```js
        import Vue from 'vue'
        ```
        >而不需要用下面的引入方式
        
        ```js
        import vue from 'vue/dist/vue.js'
        ```
        * 解决：(修改vue别名设置) [传送门](http://www.cnblogs.com/hanguidong/p/9416194.html)
            * 对比：
                >* `vue2.x`: webpack.base.conf.js这个文件已经将vue/dist.package.json的错误引用纠正成vue/dist.vue.esm.js
                >* `vue3.x`: 修改在引入vue时，不要采用runtime形式的文件,而采用 dist/vue.esm.js形式的文件
                
            * `vue2.x`: (在webpack.config.js配置)
            ```js
            module.exports = {
                resolve: {
                    alias: {
                        'vue': 'vue/dist/vue.js'
                    }
                },
            }
            ```
            * `vue3.x`: (在vue.config.js配置)
            ```js
            const path = require('path')
            function resolve (dir) {
                return path.join(__dirname,dir)
            }
            module.exports = {
                configureWebpack: config => {
                    config.resolve = {
                    extensions: ['.js', '.vue', '.json',".css"],
                        alias: {
                        'vue$': 'vue/dist/vue.esm.js',
                        '@': resolve('src'),
                        }
                    }
                },
            }
            ```
        * 笔记：[传送门](http://jiongks.name/blog/code-review-for-vue-next/)
            > Vue 最早会打包生成三个文件，一个是 runtime only 的文件 vue.common.js，一个是 compiler only 的文件 compiler.js，一个是 runtime + compiler 的文件 vue.js
            > 也就是说，vue.js = vue.common.js + compiler.js，而如果要使用 template 这个属性的话就一定要用 compiler.js，那么，引入 vue.js 是最恰当的
            
    ----