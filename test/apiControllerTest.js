const assert = require('assert');
const git = require('../lib/git');

const apiController = require('../controllers/apiController');

describe('apiController', function(){

    describe('getStatus', function(){
        before(function(){
            git.getStatus = function(callback){
                callback(['test'])
            };
            this.resMock = {
                setHeader:function(...args){this.setHeaderArgs = args;},
                send: function(arg){this.sendArgs = arg}
            };
        });

        it('should set header content type application/json', function(){
            apiController.getStatus(null, this.resMock);
            assert(this.resMock.setHeaderArgs.length === 2);
            assert(this.resMock.setHeaderArgs[0] === 'Content-Type');
            assert(this.resMock.setHeaderArgs[1] === 'application/json');
        });

        it('should send the json from the gitgetstatus call', function(){
            apiController.getStatus(null, this.resMock);
            assert(this.resMock.sendArgs==='["test"]');
        });
    });
    describe('getTree', function(){
        before(function(){
            git.getTree = function(callback){
                callback(['test'])
            };
            this.resMock = {
                setHeader:function(...args){this.setHeaderArgs = args;},
                send: function(arg){this.sendArgs = arg}
            };
        });

        it('should set header content type application/json', function(){
            apiController.getTree(null, this.resMock);
            assert(this.resMock.setHeaderArgs.length === 2);
            assert(this.resMock.setHeaderArgs[0] === 'Content-Type');
            assert(this.resMock.setHeaderArgs[1] === 'application/json');
        });

        it('should send the json from the gitgetstatus call', function(){
            apiController.getTree(null, this.resMock);
            assert(this.resMock.sendArgs==='["test"]');
        });
    });
});
