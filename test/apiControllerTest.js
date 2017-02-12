const assert = require('assert');
const git = require('../lib/git');

const apiController = require('../controllers/apiController');

describe('apiController', function(){

    describe('responseFactory', function(){

        before(function(){
            this.resMock = {
                setHeader:function(...args){this.setHeaderArgs = args;},
                send: function(arg){this.sendArgs = arg}
            };
            this.generatedFunction = apiController.responseFactory((callback)=>callback(['test']));
        });
        it('the generated function should set header content type application/json', function(){

            this.generatedFunction(null, this.resMock);
            assert(this.resMock.setHeaderArgs.length === 2);
            assert(this.resMock.setHeaderArgs[0] === 'Content-Type');
            assert(this.resMock.setHeaderArgs[1] === 'application/json');
        });

        it('the generated function should send the json given to the callback', function(){
            this.generatedFunction(null, this.resMock);
            assert(this.resMock.sendArgs==='["test"]');
        });
    });
});
