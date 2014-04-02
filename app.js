var viewModel = function (options) {
    var self = this;

    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();

    self.data = ko.observable();

    self.tick = function () {
        $.get(options.url, function (data) {
            var byColor = {};
            $.each (data.jobs, function(key, job) {
                if ( byColor[job.color] == undefined ) byColor[job.color] = [];
                byColor[job.color].push(job);
            });
            var rows = Math.ceil(data.jobs.length/10) + Math.ceil((byColor['red'] != undefined?byColor['red'].length:0)/5)*2;
            var jobs = [];
            $.each(['red', 'yellow','aborted','blue','disabled'], function(index, color) {
                if ( byColor[color] != undefined ) {
                    $.each(byColor[color], function(index, job) {
                        job.style = "width: "+(color == 'red'?20:10)+"%; height: "+Math.floor(viewportHeight / (color == 'red'?rows/2:rows))+"px;";
                        job.cssclass = "job "+color;
                        jobs.push(job);
                    });
                }
            });
            data.jobs = jobs;
            self.data(ko.mapping.fromJS(data));
        });
    };

    self.tick();
    setInterval(self.tick, options.interval);
};

$( document ).ready(function() {
    ko.applyBindings(
        new viewModel(
            { url: "/fetch.php", interval: 30000 }
        ),
        document.getElementById('jobs')
    );

    var queryVars = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    $.each(queryVars, function (i, queryVar) {
        var parts = queryVar.split('=');
        if (parts[0] == 'mvertical') {
            $('.widget-content').css({
                'margin-top': parts[1] + 'px',
                'margin-bottom': parts[1] + 'px'
            });
        }
        if (parts[0] == 'mhorizontal') {
            $('.widget-content').css({
                'margin-left': parts[1] + 'px',
                'margin-right': parts[1] + 'px'
            });
        }
    });
});


