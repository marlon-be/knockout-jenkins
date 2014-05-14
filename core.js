function EventDispatcher () {
    var $this = this,
        _events = {};
    $this.on = function(eventName, callback) {
        var callbacks = _events[eventName] = _events[eventName] || [];
        callbacks.push(callback);
    };
    $this.trigger = function(eventName, args) {
        var callbacks = _events[eventName] || [];
        for (var i = 0, l = callbacks.length; i < l; i++) {
            callbacks[i](args);
        }
    }
}
