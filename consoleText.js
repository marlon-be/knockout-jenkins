function ConsoleText (jobName, color) {
    EventDispatcher.call(this);
    ConsoleText.count++;

    var colors = {
        0: 'black',
        1: 'red',
        2: 'green',
        3: 'yellow',
        4: 'blue',
        5: 'magenta',
        6: 'cyan',
        7: 'white'
    };
    var _replaceColors = function(text) {
        $.each(colors, function (colorId, colorName) {
            text = text.replace(new RegExp('\\[3' + colorId + ';1m(.+?)\\[0m', 'g'), '<span style="color:' + colorName + '">$1</span>');
        });
        text = text.replace(/\[41;37m(.+?)\[0m/g, '<span style="background-color:red;color:white">$1</span>');
        return text;
    };

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
            _text = _replaceColors(consoleText);
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
