var CONFIG = (function() {
    var settings = {
        INTERVAL: 5000,
        FETCH_URL: '/fetch.php',
        CONSOLE_URL: '/console-text.php',
        BUILD_URL: '/build.php',
        PROGRESS_URL: '/progress.php',
        COLOR_ORDER: ['red', 'red_anime', 'yellow', 'yellow_anime','aborted', 'aborted_anime','blue', 'blue_anime','disabled', 'disabled_anime']
    };

    return {
        get: function(name) { return settings[name]; }
    };
})();
