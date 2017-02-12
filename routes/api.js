var express = require('express');
var router = express.Router();

var git = require('../lib/git');
const apiController = require('../controllers/apiController');

router.get('/status', apiController.getStatus);
router.get('/tree', apiController.getTree);
router.get('/entry/:name([\\w.]+)', apiController.getEntry);
router.get('/diff/:name([\\w.]+)', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  
  git.getDiff(req.params['name'],(data)=>res.send(JSON.stringify(data)))

});
router.get('/diffcached/:name([\\w.]+)', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  
  git.getDiffCached(req.params['name'],(data)=>res.send(JSON.stringify(data)))

});




module.exports = router;
