var viewModel = function (options) {
    var self = this;

    self.data = ko.observable();

    self.tick = function () {
        $.get(options.url, function (data) {
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
});


