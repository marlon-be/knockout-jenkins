function ConsoleText (jobName, color) {
    EventDispatcher.call(this);
    ConsoleText.count++;

    // private vars
    var $this = this,
        _loaded = false,
        _jobName = jobName,
        _color = color,
        _text;

    $this.isLoaded = function() {
        return _loaded;
    };

    $this.loadText = function() {
        $.get(CONFIG.get('CONSOLE_URL') + '?job=' + _jobName, function(consoleText) {
            _text = consoleText;
            _loaded = true;
            $this.trigger(ConsoleText.events.LOADED, {consoleText: $this});
        });
    };

    $this.getDto = function() {
        if (!_loaded) {
            throw new Error('ConsoleText is not loaded yet');
        }
        return {
            name: _jobName,
            consoleText: _text,
            cssClass: 'text-' + _color + (ConsoleText.count == 1 ? ' full-screen' : '')
        };
    };
}
ConsoleText.prototype = new EventDispatcher();
ConsoleText.prototype.constructor = ConsoleText;

ConsoleText.events = {
    LOADED: 'console.loaded'
};
ConsoleText.count = 0;
ConsoleText.clearCount = function() {
    ConsoleText.count = 0;
};
