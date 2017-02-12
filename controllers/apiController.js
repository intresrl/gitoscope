const git = require('../lib/git');

function respondWithJson(res, data) {
    res.send(JSON.stringify(data));
}

function responseFactory(gitFunctionGetter){
    return function(req, res, next){
        // i need this trick so that i can easily mock this value
        const gitFunction = gitFunctionGetter();
        res.setHeader('Content-Type', 'application/json');
        gitFunction((data)=>respondWithJson(res, data))
    }
}

const getTree = responseFactory(()=>git.getTree);
const getStatus = responseFactory(()=>git.getStatus);

module.exports = {responseFactory, getStatus, getTree};