var CONFIG = (function() {
    var settings = {
        INTERVAL: 5000,
        FETCH_URL: '/fetch.php',
        CONSOLE_URL: '/console-text.php',
        BUILD_URL: '/build.php'
    };

    return {
        get: function(name) { return settings[name]; }
    };
})();
