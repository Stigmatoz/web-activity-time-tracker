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

    incCounter(){
        this.counter +=1;

        var today = new Date().toLocaleDateString("en-US");
        var day = this.days.find(x => x.date == today);
        if (day === undefined) {
            this.addNewDay(today);
        }
        else {
            day['counter'] += 1;
            this.addInterval(day);
        }
    }

    addNewDay(today) {
        var date = new Date();
        var stringDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        this.days.push(
            {
                'date': today,
                'summary': 1,
                'counter': 1,
                'time': ["" + stringDate + '-'+ stringDate + ""]
            }
        );
    }

    addInterval(day){
        var date = new Date();
        var stringDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        if (day.time == undefined)
            day.time = [stringDate + '-'+ stringDate]; 
        else {
            day.time.push(stringDate + '-' + stringDate);
        }
    }

    closeInterval(){
        var date = new Date();
        var stringDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var today = new Date().toLocaleDateString("en-US");
        var day = this.days.find(x => x.date == today);
        if (day != undefined && day.time !== undefined){
            var interval = day.time.pop();
            day.time.push(interval.split('-')[0] + '-' + stringDate);
        }
    }
};