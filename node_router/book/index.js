//express服务器的子路由
let express = require('express')
let router = express.Router();
let mock = require('../../src/mock/index')
let data = mock.Book;
router.get('/bangumi', function(req, res) {
    res.json(data);
});

module.exports = router;