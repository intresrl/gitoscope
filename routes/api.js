var express = require('express');
var router = express.Router();

var git = require('../lib/git');

router.get('/status', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // res.send(JSON.stringify({ a: 1 }));
  git.getStatus((data)=>res.send(JSON.stringify(data)))

});
router.get('/tree', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // res.send(JSON.stringify({ a: 1 }));
  git.getTree((data)=>res.send(JSON.stringify(data)))

});
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ a: 1 }));

});
router.get('/entry/:name([\\w.]+)', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  
  git.getFile(req.params['name'], (data)=>res.send(JSON.stringify(data)))

});
router.get('/diff/:name([\\w.]+)', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  
  git.getDiff(req.params['name'],(data)=>res.send(JSON.stringify(data)))

});
router.get('/diffcached/:name([\\w.]+)', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  
  git.getDiffCached(req.params['name'],(data)=>res.send(JSON.stringify(data)))

});




module.exports = router;
