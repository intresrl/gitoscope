const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.get('/status', apiController.getStatus);
router.get('/tree', apiController.getTree);
router.get('/entry/:name([\\w.]+)', apiController.getEntry);
router.get('/diff/:name([\\w.]+)', apiController.getDiff);
router.get('/diffcached/:name([\\w.]+)', apiController.getDiffCached);

module.exports = router;
