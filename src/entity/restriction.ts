import { convertHHMMToSeconds } from '../utils/converter';

export class Restriction {
  domain: string;
  time: number;

  constructor(domain: string, hours: number, minutes: number) {
    this.domain = domain;
    this.time = convertHHMMToSeconds(hours, minutes);
  }
}
