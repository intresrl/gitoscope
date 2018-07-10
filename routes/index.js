var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/internals', function(req, res, next){
  res.render('internals');
});

router.get('/', function(req, res, next) {
  res.render('index', {});
});

module.exports = router;
