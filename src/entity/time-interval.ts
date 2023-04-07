export class TimeInterval {
    domain: string;
    intervals: any;
    day: string;
    
    constructor(day:string, domain:string) {
        this.domain = domain;
        this.intervals = [];
        this.day = day;
    }

    addInterval() {
        const stringDate = this.getCurrentStringDate();
        this.intervals.push(stringDate + '-' + stringDate);
    }

    closeInterval() {
        const stringDate = this.getCurrentStringDate();
        const currentInterval = this.intervals[this.intervals.length - 1];
        if (!currentInterval) {
            if (currentInterval.split('-')[0] == currentInterval.split('-')[1]) {
                this.intervals.pop();
                this.intervals.push(currentInterval.split('-')[0] + '-' + stringDate);
            }
        }
    }

    private getCurrentStringDate():string{
        const date = new Date();
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }
};