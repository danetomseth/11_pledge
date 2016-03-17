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

$Promise.prototype.catch = function(errorCb) {
	//console.log(this);
	return this.then(null, errorCb);
	// body...
};

$Promise.prototype.then = function(successCb, errorCb) {
    if (typeof successCb !== 'function') {
        successCb = false;
    }
    if (typeof errorCb !== 'function') {
        errorCb = false;
    }
    this.handlerGroups.push({
        successCb: successCb,
        errorCb: errorCb,
        forwarder: new Deferral()
    });
    if (this.state !== 'pending') {
        this.callHandlers();
    }
    
    else if (this.state === 'pending') {
    	return this.handlerGroups[0].forwarder.$promise;
    }
};

$Promise.prototype.callHandlers = function() {


    while (this.handlerGroups.length > 0) {
    	var resolvedFunc = this.handlerGroups.shift();

    	if (!resolvedFunc.successCb && !resolvedFunc.errorCb){
    		if (this.state === 'resolved') {
    			resolvedFunc.forwarder.resolve(this.value);
    		}
    		else if (this.state === 'rejected') {
    			resolvedFunc.forwarder.reject(this.value);
    		}
    	}


    	if (this.state === 'resolved' && resolvedFunc.successCb) {
    	
    		var resolveWith = resolvedFunc.successCb(this.value);
    		resolvedFunc.forwarder.resolve(resolveWith);

    	} else if(this.state === 'rejected' && resolvedFunc.errorCb) {
            var rejectWith = resolvedFunc.errorCb(this.value);
            resolvedFunc.forwarder.reject(rejectWith);
        }
       
       
    }

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
        if (this.$promise.handlerGroups.length !== 0) {
            this.$promise.callHandlers();
        }
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