'use strict';

class TimeInterval {
    constructor(day, domain, intervals) {
        this.domain = domain;
        if (intervals != undefined)
            this.intervals = intervals;
        else this.intervals = [];
        this.day = day;
    }

    addInterval() {
        console.log('add interval');
        var date = new Date();
        var stringDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        this.intervals.push(stringDate + '-' + stringDate);
    }

    closeInterval() {
        var today = new Date();
        var stringDate = zeroAppend(today.getHours()) + ':' + zeroAppend(today.getMinutes()) + ':' + zeroAppend(today.getSeconds());
        var currentInterval = this.intervals.pop();
        this.intervals.push(currentInterval.split('-')[0] + '-' + stringDate);
    }
};