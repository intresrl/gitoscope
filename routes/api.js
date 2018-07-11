const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.get('/status', apiController.getStatus);
router.get('/entry/:name([\\w.]+)', apiController.getEntry);
router.get('/diff/:name([\\w.]+)', apiController.getDiff);
router.get('/diffcached/:name([\\w.]+)', apiController.getDiffCached);

router.get('/commits/:commitId(\\w+)', apiController.getCommit);
router.get('/trees/:treeId(\\w+)', apiController.getTreeRest);
router.get('/blobs/:blobId(\\w+)', apiController.getBlobRest);
router.get('/references', apiController.getReferences);

module.exports = router;
