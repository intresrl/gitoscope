const git = require('../lib/git');

function respondWithJson(res, data) {
    res.send(JSON.stringify(data));
}

function responseFactory(gitFunction){
    return function(req, res, next){
        res.setHeader('Content-Type', 'application/json');
        gitFunction((data)=>respondWithJson(res, data))
    }
}

function parametricResponseFactory(gitFunction){
    return function(req, res, next){
        res.setHeader('Content-Type', 'application/json');
        gitFunction(req.params['name'], (data)=>respondWithJson(res, data))
    }
}

const getTree = responseFactory(git.getTree);
const getStatus = responseFactory(git.getStatus);

function getEntry(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    git.getFile(req.params['name'], (data)=>res.send(JSON.stringify(data)))
}

module.exports = {responseFactory, parametricResponseFactory, getStatus, getTree, getEntry};