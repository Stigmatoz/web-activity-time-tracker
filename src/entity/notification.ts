import { convertHHMMToSeconds } from '../utils/converter';
import { BaseTimeList } from './baseTimeList';

export class Notifications implements BaseTimeList {
  domain: string;
  time: number;

  constructor(domain: string, hours: number, minutes: number) {
    this.domain = domain;
    this.time = convertHHMMToSeconds(hours, minutes);
  }
}
