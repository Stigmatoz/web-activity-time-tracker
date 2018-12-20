var STORAGE_TABS = 'tabs';

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function convertSummaryTimeToString(summaryTime) {
    var sec = (summaryTime / 1000).toFixed(1);
    var min = (summaryTime / (1000 * 60)).toFixed(1);
    var hours = (summaryTime / (1000 * 60 * 60)).toFixed(1);
    var days = (summaryTime / (1000 * 60 * 60 * 24)).toFixed(1);

    if (sec < 60) {
        return sec + " sec";
    } else if (min < 60) {
        return min + " min";
    } else if (hours < 24) {
        return hours + " hours";
    } else {
        return days + " days"
    }
}