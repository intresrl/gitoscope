const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.get('/status', apiController.getStatus);
router.get('/HEAD/entries/:name([\\w.]+)', apiController.getTreeContent);
router.get('/workingCopy/entries/:name([\\w.]+)', apiController.getWorkingCopyContent);
router.get('/cache/entries/:name([\\w.]+)', apiController.getCacheContent);

// endpoints for internals
router.get('/commits/:commitId(\\w+)', apiController.getCommit);
router.get('/trees/:treeId(\\w+)', apiController.getTreeRest);
router.get('/blobs/:blobId(\\w+)', apiController.getBlobRest);
router.get('/references', apiController.getReferences);

module.exports = router;
