export function isEmpty(obj:any): boolean {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

export function convertStringTimeToSummaryTime(time:string) {
    const timeValue = time.split(':');
    const hour = Number(timeValue[0]);
    const min = Number(timeValue[1]);
    let resultTimeValue = 0;
    if (hour > 0)
        resultTimeValue = hour * 3600;
    resultTimeValue += min * 60;

    return resultTimeValue;
}