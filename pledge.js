'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise() {
    this.state = 'pending';
    this.value;
    this.handlerGroups = [];
}

$Promise.prototype.then = function(successCb, errorCb) {
    if (typeof successCb !== 'function') {
        successCb = false;
    }
    if (typeof errorCb !== 'function') {
        errorCb = false;
    }
    this.handlerGroups.push({
        successCb: successCb,
        errorCb: errorCb
    });

    //Handle func based on promise status
    if (this.state !== 'pending') {
        this.callHandlers();
    }

};

$Promise.prototype.callHandlers = function() {


    while (this.handlerGroups.length > 0) {
    	var resolvedFunc = this.handlerGroups.shift();
    	if(resolvedFunc.errorCb === false && resolvedFunc.successCb === false){

    	}
        else if (this.state === 'resolved') {

            resolvedFunc.successCb(this.value);
        } else if(this.state === 'rejected') {
        	console.log(resolvedFunc)
           
            resolvedFunc.errorCb(this.value);
        }

    }

// body...
};

function Deferral() {
    this.$promise = new $Promise()
}

Deferral.prototype.resolve = function(data) {
    if (this.$promise.state === 'pending') {
        this.$promise.value = data;
        this.$promise.state = 'resolved';
        if (this.$promise.handlerGroups.length !== 0) {
            this.$promise.callHandlers();
        }
    }
};

Deferral.prototype.reject = function(reason) {
    if (this.$promise.state === 'pending') {
        this.$promise.value = reason;
        this.$promise.state = 'rejected';
    }
};

function defer() {
    var obj = new Deferral();
    return obj;
}









/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/