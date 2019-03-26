'use strict';

class Restriction {
    constructor(domain, time) {
        this.domain = domain;
        var timeValue = time.split(':');
        var hour = timeValue[0];
        var min = timeValue[1];
        var resultTimeValue;
        if (hour > 0)
            resultTimeValue = hour * 60 * 3600;
        resultTimeValue += min * 60;
        this.time = resultTimeValue;
    }
};