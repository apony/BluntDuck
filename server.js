/*
 * @Author: apony 
 * @Date: 2018-09-13 15:22:07 
 * @Last Modified by:   apony 
 * @Last Modified time: 2018-09-13 15:22:07 
 */

//抛出异常：SyntaxError: Unexpected token import 
//node.js只支持部分 ES6 的语法(ES6模块化语法import和export /default暂不支持，需要babel转译)
//用express模块模拟后台，建立服务器
var express = require('express')
var app = express()
//路由表
var routes = require('./node_router/index')
routes(app)

//服务器运行部署文件夹dist
// var path = require('path')
// app.use(express.static(path.join(__dirname, 'dist')))

//开启服务器(http://127.0.0.1:8888/)
//此处注意: 1.应填写已存在的域名(不然server.address().address为:::) 
//         2.端口号不能被占用的坑 Error: listen EADDRINUSE :::9999
var server = app.listen(8888,'localhost', function () {
  var host = server.address().address
  var port = server.address().port
  console.log('running at http://' + host + ':' + port)
 
})

