import { logger } from '../utils/logger';

export class TimeInterval implements ISerializable<TimeInterval> {
  domain: string = '';
  intervals: string[] = [];
  day: string = '';

  init(day: string, domain: string) {
    this.domain = domain;
    this.intervals = [];
    this.day = day;
  }

  addInterval() {
    const stringDate = this.getCurrentStringDate();
    this.intervals.push(stringDate + '-' + stringDate);
    logger.log(`Add interval ${this.domain} - ${stringDate} - ${stringDate}`);
  }

  closeInterval() {
    const stringDate = this.getCurrentStringDate();
    const currentInterval = this.intervals[this.intervals.length - 1];
    if (currentInterval != null) {
      if (currentInterval.split('-')[0] == currentInterval.split('-')[1]) {
        this.intervals.pop();
        this.intervals.push(currentInterval.split('-')[0] + '-' + stringDate);
        logger.log(
          `Close interval ${this.domain} - ${currentInterval.split('-')[0]} - ${stringDate}`,
        );
      }
    }
  }

  deserialize(input: TimeInterval): TimeInterval {
    this.domain = input.domain;
    this.day = input.day;
    this.intervals = input.intervals;

    return this;
  }

  private getCurrentStringDate(): string {
    const date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
}
