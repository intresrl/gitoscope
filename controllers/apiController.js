const git = require('../lib/git');

function respondWithJson(res, data) {
    res.send(JSON.stringify(data));
}

function promiseResponseFactory(gitFunction){
    return function(req, res, next){
        res.setHeader('Content-Type', 'application/json');
        gitFunction().then((data)=>respondWithJson(res, data))
    }
}

function parametricResponse(gitFunction, paramName) {
    return function (req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        gitFunction(req.params[paramName]).then((data) => respondWithJson(res, data)).catch((err)=>err);
    }
}
function parametricPromiseResponseFactory(gitFunction){
    return parametricResponse(gitFunction, 'name');
}

const getReferences = promiseResponseFactory(git.getReferences);
const getStatus = promiseResponseFactory(git.getStatus);
const getTreeContent = parametricPromiseResponseFactory(git.getTreeContent);
const getWorkingCopyContent = parametricPromiseResponseFactory(git.getWorkingCopyContent);
const getCacheContent = parametricPromiseResponseFactory(git.getCacheContent);
const getCommit = parametricResponse(git.getCommit, 'commitId');
const getTreeRest = parametricResponse(git.getTreeRest, 'treeId');
const getBlobRest = parametricResponse(git.getBlobRest, 'blobId');


module.exports = {getStatus, getTreeContent, getWorkingCopyContent, getCacheContent,
    getCommit, getTreeRest, getBlobRest, getReferences
};