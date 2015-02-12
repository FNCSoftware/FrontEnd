function Event(name) {
    this.name = name;
    this.callbacks = [];
}
Event.prototype.registerCallback = function (callback) {
    this.callbacks.push(callback);
}


var fncNS = fncNS || {};

fncNS.reactor = (function () {
    var events = {};
    var dispatchedEvents = [];  // this will allow subscriptions to already dispatched events, very handy

    function registerEvent(eventName) {

        // we will need to check for unique eventNames
        if (events[eventName] === undefined) {
            var event = new Event(eventName);
            events[eventName] = event;
        }

    }

    function dispatchEvent(eventName, eventArgs) {
        events[eventName].callbacks.forEach(function (callback) {
            if (callback) callback(eventArgs);
        });

        dispatchedEvents.push(eventName);
    }

    function addEventListener(eventName, callback) {
        // check if the event has already been dispatched
        for (var i = 0; i < dispatchedEvents.length; i++) {
            if (dispatchedEvents[i] === eventName) {
                if (callback) callback();
            }
        }

        events[eventName].registerCallback(callback);
        var count = events[eventName].callbacks.length - 1;
        return count;
    }

    function removeEventListener(eventName, id) {
        events[eventName].callbacks[id] = undefined;
    }

    function resetEvent(eventName) {
        for (var i = 0; i < dispatchedEvents.length; i++) {
            if (dispatchedEvents[i] === eventName) {
                dispatchedEvents[i] = '';
            }
        }
    }

    return {
        registerEvent: registerEvent,
        dispatchEvent: dispatchEvent,
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        resetEvent: resetEvent
    }
})();