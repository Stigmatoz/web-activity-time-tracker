var STORAGE_TABS = 'tabs';
var SETTINGS_INTERVAL_INACTIVITY = 30;
var SETTINGS_INTERVAL_CHECK = 1000;
var SETTINGS_INTERVAL_SAVE_STORAGE = 3000;
var SETTINGS_INTERVAL_CHECK_STORAGE = 3000;

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function convertSummaryTimeToString(summaryTime) {
    var sec = (summaryTime);
    var min = (summaryTime / 60);
    var hours = (summaryTime / (60 * 60));
    var days = (summaryTime / (60 * 60 * 24));

    if (sec < 60) {
        return sec + " s";
    } else if (min < 60) {
        return min + " m";
    } else if (hours < 24) {
        return hours + " h";
    } else {
        return days + " d"
    }
}