import { todayLocalDate } from "../utils/today";
import { logger } from "../compositions/logger";

export class Tab implements ISerializable<Tab> {
    url: string = '';
    favicon: string = '';
    summaryTime: number = 0;
    counter: number = 0
    days: TabDay[] = [];

    init(url: string){
        this.url = url;
    }

    incSummaryTime() :void {
        this.summaryTime += 1;
        //logger.log(`Summary time ${this.url} - ${this.summaryTime}`);

        const day = this.days.find(x => x.date == todayLocalDate());
        if (day === undefined) 
            this.addNewDay();
        else day.incSummaryTime();
    }

    incCounter() :void {
        this.counter +=1;
        logger.log(`Counter ${this.url} - ${this.counter}`);
        const day = this.days.find(x => x.date == todayLocalDate());
        if (day === undefined)
            this.addNewDay();
        else day.incCounter()
    }

    addNewDay() :void {
        const newTabDay = new TabDay();
        newTabDay.init(todayLocalDate());
        this.days.push(newTabDay);
    }

    deserialize(input: Tab) {
        this.url = input.url;
        this.counter = input.counter;
        this.favicon = input.favicon;
        this.summaryTime = input.summaryTime;
        if (input.days?.length > 0)
            this.days = input.days.map(x =>  new TabDay().deserialize(x));

        return this;
    }

    setFavicon(favicon: string | undefined){
        if (favicon != undefined)
            this.favicon = favicon;
        else
            this.favicon = "chrome://favicon/" + this.url;
    }
}

export class TabDay implements ISerializable<TabDay> {
    counter: number = 0;
    date: string = '';
    summary: number = 0;

    init(date: string){
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

    deserialize(input: TabDay): TabDay {
        this.counter = input.counter;
        this.date = input.date;
        this.summary = input.summary;

        return this;
    }
}
