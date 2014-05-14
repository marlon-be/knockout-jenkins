function BuildBar () {

    var $this = this,
        _total = 0,
        _colors = {};

    $this.addJob = function(job) {
        if (!(job instanceof Job)) {
            throw new Error('job must be an instance of Job');
        }

        var colorName = job.getColor();
        if (typeof _colors[colorName] === 'undefined') {
            _colors[colorName] = 0;
        }
        _total++;
        _colors[colorName]++;
    };

    $this.getDto = function() {
        var colors = [];
        $.each(_colors, function(colorName, colorCount) {
            colors.push({
                name: colorName,
                count: colorCount,
                percentage: (colorCount * 100 / _total) + '%'
            });
        });
        return colors;
    }
}
