export function convertStringTimeToSummaryTime(time: string) {
    const timeValue = time.split(':');
    const hour = Number(timeValue[0]);
    const min = Number(timeValue[1]);
    let resultTimeValue = 0;
    if (hour > 0)
        resultTimeValue = hour * 3600;
    resultTimeValue += min * 60;

    return resultTimeValue;
}

export function convertSummaryTimeToBadgeString(summaryTime: number): string {
    const sec = summaryTime;
    const min = Number((summaryTime / 60).toFixed(0));
    const hours = Number((summaryTime / (60 * 60)).toFixed(1));

    if (sec < 60) return `${sec}s`;
    else if (min < 60) return `${min}m`;
    else return `${hours}h`;
}

export function convertSummaryTimeToString(summaryTime:number) {
    let days = Math.floor(summaryTime / 3600 / 24);
    const totalHours = summaryTime % (3600 * 24);
    let hours = Math.floor(totalHours / 3600);
    const totalSeconds = summaryTime % 3600;
    let mins = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    hours = zeroAppend(hours);
    mins = zeroAppend(mins);
    seconds = zeroAppend(seconds);

    function appendTime(value:number, stringPrefix:string){
        return value > 0 ? `${value} ${stringPrefix}` : '';
    }

    return `${appendTime(days, 'd')} ${appendTime(hours, 'h')} ${appendTime(mins, 'm')} ${appendTime(seconds, 's')}`;
}

function zeroAppend(time:number) {
    if (time < 10)
        return Number('0' + time);
    else return time;
}