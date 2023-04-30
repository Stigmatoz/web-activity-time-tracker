import { convertStringTimeToSummaryTime } from "../utils/converter";

export class Restriction {
    domain: string;
    time: number;

    constructor(domain: string, time: string) {
        this.domain = domain;
        this.time = convertStringTimeToSummaryTime(time);
    }
}