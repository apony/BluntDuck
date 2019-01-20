// // see http://vuejs-templates.github.io/webpack for documentation.
// var path = require('path');

// // const devProxy = ['api/**'];  // 代理
// var proEnv = require('./config/pro.env');  // 生产环境
// var uatEnv = require('./config/uat.env');  // 测试环境
// var devEnv = require('./config/dev.env');  // 本地环境
// const env = process.env.NODE_ENV;
// let target = '';
// // 默认是本地环境
// if(env==='production'){  // 生产环境
//     target = proEnv.hosturl;
// }else if(env==='test'){ // 测试环境
//     target = uatEnv.hosturl;
// }else{  // 本地环境
//     target = devEnv.hosturl;
// }

// module.exports = {
//     // publicPath: '/',
//     // outputDir: 'dist',
//     devServer: {
//         // open: process.platform === 'darwin',
//         // host: '0.0.0.0',
//         // port: 8888,
//         https: false,
//         hotOnly: false,
//         disableHostCheck: true,
//         // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
//         proxy: {
//             '/api' :{
//                 target: target,
//                 changeOrigin: true,
//                 pathRewrite: {
//                     '^/api': ''
//                 }
//             }
//         }, // string | Object
//         // before: app => {}
//     }
// };

const path = require('path')
const mock = require('./src/mock')

module.exports = {
    // 基本路径
    publicPath: '/',
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    // compiler: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: () => {},
    configureWebpack: () => {},
    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    // vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    // css相关配置
    css: {
     // 是否使用css分离插件 ExtractTextPlugin
     extract: true,
     // 开启 CSS source maps?
     sourceMap: false,
     // css预设器配置项
     loaderOptions: {},
     // 启用 CSS modules for all css / pre-processor files.
     modules: false
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
    //  open: process.platform === 'darwin',
    //  host: '10.98.12.160',
    //  port: 8080,
    //  https: false,
    //  hotOnly: false,
    //  proxy: null, // 设置代理
     before: app => {mock(app)}
    },
    // 第三方插件配置
    pluginOptions: {
     // ...
    },
    chainWebpack: (config)=>{
        config.resolve.alias
            .set('@', path.join(__dirname, 'src'))
            .set('@api', path.join(__dirname, 'src/api'))
            .set('@services', path.join(__dirname, 'src/services'))
            .set('@utils', path.join(__dirname, 'src/utils'))
            .set('@mock', path.join(__dirname, 'src/mock'))
            .set('@filters', path.join(__dirname, 'src/filters'))
            .set('@store', path.join(__dirname, 'src/store'))
    }
}