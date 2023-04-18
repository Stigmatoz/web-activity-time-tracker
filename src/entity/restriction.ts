import { convertStringTimeToSummaryTime } from "../common/utility";

export class Restriction {
    domain: string;
    time: number;

    constructor(domain: string, time: string){
        this.domain = domain;
        this.time = convertStringTimeToSummaryTime(time);
    }
}