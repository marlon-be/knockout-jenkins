var viewModel = function (options) {
    var self = this;

    self.data = ko.observable();
    var queryVars = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var marginVertical = 0, marginHorizontal = 0;
    $.each(queryVars, function (i, queryVar) {
        var parts = queryVar.split('=');
        if (parts[0] == 'mvertical') {
            marginVertical = parts[1];
        }
        if (parts[0] == 'mhorizontal') {
            marginHorizontal = parts[1];
        }
    });
    $('#positioning').css({
        'padding-top': marginVertical + 'px',
        'padding-bottom': marginVertical + 'px'
    });
    $('#positioning').css({
        'padding-left': marginHorizontal + 'px',
        'padding-right': marginHorizontal + 'px'
    });

    $(document).on('DOMNodeInserted', '.console-text .text', function() {
        $(this).scrollTop($(this).height());
    });


    self.tick = function () {
        var data = {},
            retrievedConsoles = {};

        var finalizeTick = function() {
            data.queue = data.building;
            data.consoles = [];
            $.each(retrievedConsoles, function(name, text) {
                data.consoles.push({
                    name: name,
                    consoleText: text
                });
            });
            self.data(ko.mapping.fromJS(data));
        };

        var fixColor = function (job) {
            if (job.color.substr(job.color.length - 6) == '_anime') {
                    job.color = job.color.substr(0, job.color.length - 6);
                    job.building = true;
                } else {
                    job.building = false;
                }
        };

        var loadConsoleText = function(name) {
            $.get(options.consoleUrl, function(consoleText) {
                retrievedConsoles[ name ] = consoleText;
                var allTextsPresent = true;
                $.each(retrievedConsoles, function(buildName, text) {
                    if (text === false) {
                        allTextsPresent = false;
                        return false;
                    }
                });
                if (allTextsPresent) {
                    finalizeTick();
                }
            });
        };

        $.get(options.url, function (getData) {
            var byColor = {};
            $.each (getData.jobs, function(key, job) {
                fixColor(job);
                if ( byColor[job.color] == undefined ) byColor[job.color] = [];
                byColor[job.color].push(job);
            });
            var viewportWidth = $('.jobs-container').width(), viewportHeight = $(window).height(),
                rows = Math.ceil(getData.jobs.length/10);
            var maxHeight = Math.floor(viewportHeight / rows), maxWidth = Math.floor(viewportWidth / 10);
            var size = (maxWidth<maxHeight?maxWidth:maxHeight)-(34);
            data.jobs = [];
            data.building = [];
            data.colors = [];
            $.each(['red', 'red_anime', 'yellow', 'yellow_anime','aborted', 'aborted_anime','blue', 'blue_anime','disabled', 'disabled_anime'], function(index, color) {
                if ( byColor[color] != undefined ) {
                    var colorObj = {name: color, count: 0};
                    $.each(byColor[color], function(index, job) {
                        colorObj.count++;
                        job.size = size + 'px';
                        job.cssClass = job.color;
                        if (job.building) {
                            job.cssClass += ' building';
                            data.building.push(job);
                            retrievedConsoles[ job.name ] = false;
                            loadConsoleText(job.name);
                        }
                        data.jobs.push(job);
                    });
                    data.colors.push(colorObj);
                }
            });
            var totalJobs = data.jobs.length;
            $.each(data.colors, function(index, color) {
                color.percentage = Math.round(color.count * 100 / totalJobs) + '%';
            });

            if (!retrievedConsoles) {
                finalizeTick();
            }
        });
    };

    self.tick();
    setInterval(self.tick, options.interval);
};

$( document ).ready(function() {
    ko.applyBindings(
        new viewModel(
            { url: "/fetch.php", consoleUrl: '/console-text.php', interval: 5000 }
        ),
        document.getElementById('jobs')
    );
});


