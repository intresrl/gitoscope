const git = require('../lib/git');

function respondWithJson(res, data) {
    res.send(JSON.stringify(data));
}

function responseFactory(gitFunction){
    return function(req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        gitFunction((data) => respondWithJson(res, data))
    }
}

function promiseResponseFactory(gitFunction){
    return function(req, res, next){
        res.setHeader('Content-Type', 'application/json');
        gitFunction().then((data)=>respondWithJson(res, data))
    }

}

function parametricResponseFactory(gitFunction){
    return function(req, res, next){
        res.setHeader('Content-Type', 'application/json');
        gitFunction(req.params['name'], (data)=>respondWithJson(res, data))
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

const getTree = promiseResponseFactory(git.getTree);
const getStatus = promiseResponseFactory(git.getStatus);
const getEntry = parametricPromiseResponseFactory(git.getFile);
const getDiff = parametricPromiseResponseFactory(git.getDiff);
const getDiffCached = parametricPromiseResponseFactory(git.getDiffCached);

module.exports = {responseFactory, parametricResponseFactory, getStatus, getTree, getEntry, getDiff, getDiffCached};[]