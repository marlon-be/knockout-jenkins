function Build (jobName) {
    EventDispatcher.call(this);
    // private vars
    var $this = this,
        _loaded = false,
        _culprits = [],
        _percentage = 0;

    $this.isLoaded = function() {
        return _loaded;
    };

    $this.load = function() {
        $.get(CONFIG.get('BUILD_URL') + '?job=' + jobName, function(build) {
            _culprits = [];
            $.each(build.culprits, function(i, culprit) {
                _culprits.push(culprit.fullName);
            });
            _percentage = Math.round((build.duration * 100) / build.estimatedDuration);
            _loaded = true;

            $this.trigger(Build.events.LOADED, {build: $this});
        });
    };

    $this.getCulprits = function() {
        if (!_loaded) {
            throw new Error('Build is not loaded yet');
        }
        return _culprits;
    };

    $this.getPercentage = function() {
        if (!_loaded) {
            throw new Error('Build is not loaded yet');
        }
        return _percentage;
    };
}
Build.prototype = new EventDispatcher();
Build.prototype.constructor = Build;

Build.events = {
    LOADED: 'build.loaded'
};
