var viewModel = function (options) {
    var self = this;

    self.data = ko.observable();

    self.tick = function () {
        $.get(options.url, function (data) {
            var byColor = {};
            $.each (data.jobs, function(key, job) {
                if ( byColor[job.color] == undefined ) byColor[job.color] = [];
                byColor[job.color].push(job);
            });
            var viewportWidth = $(window).width(), viewportHeight = $(window).height(),
                rows = Math.ceil(data.jobs.length/10);
            var maxHeight = Math.floor(viewportHeight/rows), maxWidth = Math.floor(viewportWidth/10);
            var size = (maxWidth<maxHeight?maxWidth:maxHeight)-32;
            data.jobs = [];
            data.failed = [];
            $.each(['red', 'yellow','aborted','blue','disabled'], function(index, color) {
                if ( byColor[color] != undefined ) {
                    $.each(byColor[color], function(index, job) {
                        job.cssclass = "job "+color;
                        if ( color == 'red' ) {
                            job.style = "width: "+(size*2)+"px; height: "+(size*2)+"px;";
                            data.failed.push(job);
                        } else {
                            job.style = "width: "+size+"px; height: "+size+"px;";
                            data.jobs.push(job);
                        }
                    });
                }
            });
            self.data(ko.mapping.fromJS(data));
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


