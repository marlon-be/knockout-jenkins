var viewModel = function (options) {
    var self = this;

    self.data = ko.observable();
    var queryVars = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var top = 0, left = 0;
    $.each(queryVars, function (i, queryVar) {
        var parts = queryVar.split('=');
        if (parts[0] == 'mvertical') {
            top = parts[1];
        }
        if (parts[0] == 'mhorizontal') {
            left = parts[1];
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
            var maxHeight = Math.floor((viewportHeight-top)/rows), maxWidth = Math.floor((viewportWidth-left)/10);
            var size = (maxWidth<maxHeight?maxWidth:maxHeight)-(34);
            data.jobs = [];
            data.failed = [];
            $.each(['red', 'yellow','aborted','blue','disabled'], function(index, color) {
                if ( byColor[color] != undefined ) {
                    $.each(byColor[color], function(index, job) {
                        job.cssclass = "job "+color;
                        if ( color == 'red' ) {
                            job.style = "width: "+(size)+"px; height: "+(size)+"px;";
                            data.failed.push(job);
                        } else {
                            job.style = "width: "+size+"px; height: "+size+"px;";
                            data.jobs.push(job);
                        }
                    });
                }
            });
            self.data(ko.mapping.fromJS(data));
            $('.widget-content > ul').css({
                top: top + 'px'
            });
            $('.widget-content > ul').css({
                left: left + 'px'
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


