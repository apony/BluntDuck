//express路由表
var bookRouter = require('./book/index')
module.exports = function route(app) {
    app.use('/api/book', bookRouter)
}