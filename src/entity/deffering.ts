import { MINUTE } from '../utils/time';

export class Deffering {
  domain: string;
  time: number;

  constructor(domain: string, minutes: number) {
    this.domain = domain;
    this.time = Date.now() + minutes * MINUTE;
  }
}
