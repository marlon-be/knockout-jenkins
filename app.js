var viewModel = function (options) {
    var self = this;
    self.data = ko.observable();


    self.tick = function () {
        var data = {};

        var buildBar = new BuildBar();
        ConsoleText.clearCount();
        var jobs = [];
        var assignDtos = function() {
            var viewportWidth = $('.jobs-container').width(), viewportHeight = $(window).height(),
                rows = Math.ceil(jobs.length/10);
            var maxHeight = Math.floor(viewportHeight / rows), maxWidth = Math.floor(viewportWidth / 10);
            var size = (maxWidth<maxHeight?maxWidth:maxHeight)-(34);
            data.jobs = [];
            data.consoles = [];
            $.each(options.order, function(i, colorName) {
                $.each(jobs, function(key, job) {
                    if (job.hasColor(colorName)) {
                        buildBar.addJob(job);
                        var dto = job.getDto();
                        dto.size = size + 'px';
                        data.jobs.push(dto);
                        if (job.isBuilding()) {
                            var consoleDto = job.getConsoleText().getDto();
                            consoleDto.name += ' (' + dto.percentage + '%)';
                            data.consoles.push(consoleDto);
                        }
                    }
                });
            });

            data.colors = buildBar.getDto();

            self.data(ko.mapping.fromJS(data));
        };

        $.get(options.url, function (getData) {
            var toLoad = [];
            $.each(getData.jobs, function(key, apiJob) {
                if (apiJob._class !== 'hudson.model.FreeStyleProject') {
                    return true;
                }

                var job = new Job(apiJob);
                jobs.push(job);
                if (!job.isLoaded()) {
                    toLoad.push(job);
                }
            });

            if (toLoad.length == 0) {
                assignDtos();
            } else {
                $.each(toLoad, function(i, job) {
                    job.on(Job.events.LOADED, function(params) {
                        var index = $.inArray(params.job, toLoad);
                        toLoad.splice(index, 1);
                        if (toLoad.length == 0) {
                            assignDtos();
                        }
                    });
                    job.load();
                });
            }
        });
    };

    self.tick();
    setInterval(self.tick, options.interval);
};

$( document ).ready(function() {
    var queryVars = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'),
        marginVertical = 0,
        marginHorizontal = 0,
        $positioningDiv = $('#positioning');

    $.each(queryVars, function (i, queryVar) {
        var parts = queryVar.split('=');
        if (parts[0] == 'mvertical') {
            marginVertical = parts[1];
        }
        if (parts[0] == 'mhorizontal') {
            marginHorizontal = parts[1];
        }
    });
    $positioningDiv.css({
        'padding-top': marginVertical + 'px',
        'padding-bottom': marginVertical + 'px',
        'padding-left': marginHorizontal + 'px',
        'padding-right': marginHorizontal + 'px'
    });

    $(document).on('DOMNodeInserted', '.console-text .text', function() {
        $(this).scrollTop($(this).find('pre').height());
    });

    ko.applyBindings(
        new viewModel(
            { url: CONFIG.get('FETCH_URL'), interval: CONFIG.get('INTERVAL'), order: CONFIG.get('COLOR_ORDER') }
        ),
        document.getElementById('jobs')
    );
});


