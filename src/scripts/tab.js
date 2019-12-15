'use strict';

class Tab {
    constructor(url, favicon, days, summary, counter) {
        this.url = url;
        this.favicon = favicon;
        if (summary !== undefined)
            this.summaryTime = summary;
        else
            this.summaryTime = 0;
        if (counter !== undefined)
            this.counter = counter;
        else
            this.counter = 0;
        if (days !== undefined)
            this.days = days;
        else
            this.days = [];
    }

    incSummaryTime() {
        this.summaryTime += 1;

        var today = new Date().toLocaleDateString("en-US");
        var day = this.days.find(x => x.date == today);
        if (day === undefined) {
            this.addNewDay(today);
        }
        else {
            day['summary'] += 1;
        }
    }

    getTodayTime(){
        var today = new Date().toLocaleDateString("en-US");
        return this.days.find(x => x.date == today).summary;
    }

    incCounter(){
        this.counter +=1;

        var today = new Date().toLocaleDateString("en-US");
        var day = this.days.find(x => x.date == today);
        if (day === undefined) {
            this.addNewDay(today);
        }
        else {
            day['counter'] += 1;
        }
    }

    addNewDay(today) {
        this.days.push(
            {
                'date': today,
                'summary': 1,
                'counter': 1
            }
        );
    }
};