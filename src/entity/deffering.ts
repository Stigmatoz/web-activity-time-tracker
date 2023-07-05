import { MINUTE } from '../utils/time';
import { BaseTimeList } from './baseTimeList';

export class Deffering implements BaseTimeList {
  domain: string;
  time: number;

  constructor(domain: string, minutes: number) {
    this.domain = domain;
    this.time = Date.now() + minutes * MINUTE;
  }
}
