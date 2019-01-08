'use strict';

class Tab {
    constructor(url, favicon) {
        this.url = url;
        this.favicon = favicon;
        this.summaryTime = 0;
        this.days = [];
    }

    incSummaryTime() {
        var today = new Date().toLocaleDateString();
        var day = this.days.find(x => x.date == today);
        if (day === undefined) {
            this.addNewDay(today);
        }
        else {
            this.summaryTime += 1;
            day['summary'] += 1;
        }
    }

    addNewDay(today){
        this.summaryTime += 1;
        this.days.push(
            {
                'date': today,
                'summary': this.summaryTime
            }
        );
    }
};