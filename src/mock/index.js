const Mock = require('mockjs')
const util = require('./util.js')
const httpProxyMiddleware = require('http-proxy-middleware');
module.exports = function(app){
    //反向代理服务器
    // app.use('/api',httpProxyMiddleware({
    //     target:'http://api01.bitspaceman.com:8000',
    //     changeOrigin:true,
    //     pathRewrite: {
    //     '^/api/' : '',
    //     },
    // }))

    //代理网易云音乐node版服务器(二次代理...)
    app.use('/api',httpProxyMiddleware({
        target:'http://localhost:3000',
        changeOrigin:true,
        pathRewrite: {
        '^/api/' : '',
        },
    }))
    //mock模拟数据
    // app.get('/api/test', function (rep, res) {
    //     var json = util.getJsonFile('./book.json')
    //     res.json(Mock.mock(json))
    // })
}