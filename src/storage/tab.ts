import { todayLocalDate } from "../utils/common";

export class Tab {
    url: string;
    favicon: string;
    summaryTime: number = 0;
    counter: number = 0
    days: TabDay[] = [];

    constructor(url: string, favicon: string){
        this.url = url;
        this.favicon = favicon;
    }

    incSummaryTime() :void {
        this.summaryTime += 1;  

        const day = this.days.find(x => x.date == todayLocalDate());
        if (day === undefined) 
            this.addNewDay();
        else day.incSummaryTime();
    }

    incCounter() :void {
        this.counter +=1;
        const day = this.days.find(x => x.date == todayLocalDate());
        if (day === undefined)
            this.addNewDay();
        else day.incCounter()
    }

    addNewDay() :void {
        const newTabDay = new TabDay(todayLocalDate());
        this.days.push(newTabDay);
    }
}

export class TabDay {
    counter: number;
    date: string;
    summary: number;

    constructor(date: string){
        this.date = date;
        this.counter = 1;
        this.summary = 1;
    }

    incSummaryTime() :void {
        this.summary += 1;
    }

    incCounter() :void {
        this.counter += 1;
    }
}