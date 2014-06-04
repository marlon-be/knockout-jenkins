function Job (apiJob) {
    EventDispatcher.call(this);
    // private vars
    var $this = this,
        _name = apiJob.name,
        _url = apiJob.url,
        _percentage = 100,
        _fullColor,
        _color,
        _building,
        _failed,
        _consoleText,
        _build,
        _init = function(color) {
            _fullColor = color;
            if (color.substr(color.length - 6) == '_anime') {
                _color = color.substr(0, color.length - 6);
                _building = true;
                _consoleText = new ConsoleText(_name, _color);
            } else {
                _color = color;
                _building = false;
            }
            _failed = _color === 'red';

            if (_building) {
                _percentage = undefined;
                $.get(CONFIG.get('PROGRESS_URL') + '?job=' + _name, function(progress) {
                    _percentage = progress;
                    if ($this.isLoaded()) {
                        $this.trigger(Job.events.LOADED, { job: $this });
                    }
                });
            }
            if (_failed) {
                _build = new Build(_name);
            }
        };

    this.isLoaded = function() {
        return (typeof _consoleText === 'undefined' || _consoleText.isLoaded()) &&
            (typeof _build === 'undefined' || _build.isLoaded()) &&
            typeof _percentage !== 'undefined';
    };

    $this.getColor = function() {
        return _color;
    };

    $this.isBuilding = function() {
        return _building;
    };

    $this.isFailed = function() {
        return _failed;
    };

    $this.getConsoleText = function() {
        return _consoleText;
    };

    $this.getName = function() {
        return _name;
    };

    $this.hasColor = function(colorName) {
        return _fullColor === colorName;
    };

    $this.getDto = function() {
        if (!$this.isLoaded()) {
            throw new Error('Job is not loaded yet');
        }
        return {
            name: _name,
            url: _url,
            cssClass: _color + (_building ? ' building' : ''),
            culprits: _build ? _build.getCulprits() : [],
            percentage: _percentage
        };
    };

    $this.load = function() {
        var callBack = function() {
            if ($this.isLoaded()) {
                $this.trigger(Job.events.LOADED, { job: $this });
            }
        };

        if (_build) {
            _build.on(Build.events.LOADED, callBack);
            _build.load();
        }
        if (_consoleText) {
            _consoleText.on(ConsoleText.events.LOADED, callBack);
            _consoleText.loadText();
        }
    };

    _init(apiJob.color);
}
Job.prototype = new EventDispatcher();
Job.prototype.constructor = Job;

Job.events = {
    LOADED: 'job.loaded'
};
