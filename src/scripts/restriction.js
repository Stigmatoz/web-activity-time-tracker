'use strict';

class Restriction {
    constructor(url, time) {
        this.url = new Url(url);
        this.time = convertTimeToSummaryTime(time);
    }
};

class Notification{
    constructor(url, time) {
        this.url = new Url(url);
        this.time = convertTimeToSummaryTime(time);
    }
};