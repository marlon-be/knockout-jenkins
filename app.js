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


    self.tick = function () {
        $.get(options.url, function (data) {
            var byColor = {};
            $.each (data.jobs, function(key, job) {
                if ( byColor[job.color] == undefined ) byColor[job.color] = [];
                byColor[job.color].push(job);
            });
            var viewportWidth = $('.widget-content').width(), viewportHeight = $(window).height(),
                rows = Math.ceil(data.jobs.length/10);
            var maxHeight = Math.floor((viewportHeight - (marginVertical * 2) )/rows), maxWidth = Math.floor((viewportWidth- (marginHorizontal * 2))/10);
            var size = (maxWidth<maxHeight?maxWidth:maxHeight)-(34);
            data.jobs = [];
            data.failed = [];
            data.colors = [];
            $.each(['red', 'yellow','aborted','blue','disabled'], function(index, color) {
                if ( byColor[color] != undefined ) {
                    var colorObj = {name: color, count: 0};
                    $.each(byColor[color], function(index, job) {
                        colorObj.count++;
                        job.cssclass = "job "+color;
                        job.size = size + 'px';
                        if ( color == 'red' ) {
                            data.failed.push(job);
                        } else {
                            data.jobs.push(job);
                        }
                    });
                    data.colors.push(colorObj);
                }
            });
            var totalJobs = data.jobs.length + data.failed.length;
            $.each(data.colors, function(index, color) {
                color.percentage = Math.round(color.count * 100 / totalJobs) + '%';
            });
            self.data(ko.mapping.fromJS(data));
            $('#positioning').css({
                'padding-top': marginVertical + 'px',
                'padding-bottom': marginVertical + 'px'
            });
            $('#positioning').css({
                'padding-left': marginHorizontal + 'px',
                'padding-right': marginHorizontal + 'px'
            });
        });
    };

    self.tick();
    setInterval(self.tick, options.interval);
};

$( document ).ready(function() {
    ko.applyBindings(
        new viewModel(
            { url: "/fetch.php", interval: 5000 }
        ),
        document.getElementById('jobs')
    );
});


