'use strict';

class Restriction {
    constructor(domain, time) {
        this.domain = domain;
        this.time = convertTimeToSummaryTime(time);
    }
};

class Notification{
    constructor(domain, time) {
        this.domain = domain;
        this.time = convertTimeToSummaryTime(time);
    }
};