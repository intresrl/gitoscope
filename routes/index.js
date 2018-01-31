var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/internals', function(req, res, next){
  res.render('internals');
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'GitLens' });
});

router.get('/react', function(req, res, next) {
  res.render('indexReact', { });
});

module.exports = router;
