var RangeForDays = {
    days2: 'days2',
    days3: 'days3',
    days4: 'days4',
    days5: 'days5',
    days6: 'days6',
    days7: 'days7',
    month1: 'month1',
    month2: 'month2',
    month3: 'month3'
};

var InactivityInterval = {
    second30: 0.3,
    second45: 0.45,
    min1: 1,
    min2: 2,
    min5: 5,
    min10: 10,
    min20: 20,
    min30: 30,
    min40: 40
};

var TypeListEnum = {
    ToDay: 1,
    All: 2,
    ByDays: 3,
};

var STORAGE_TABS = 'tabs';

var SETTINGS_INTERVAL_INACTIVITY_DEFAULT = InactivityInterval.second30;
var SETTINGS_INTERVAL_CHECK_DEFAULT = 1000;
var SETTINGS_INTERVAL_SAVE_STORAGE_DEFAULT = 3000;
var SETTINGS_INTERVAL_CHECK_STORAGE_DEFAULT = 3000;
var SETTINGS_INTERVAL_RANGE_DEFAULT = RangeForDays.days7;
var SETTINGS_VIEW_TIME_IN_BADGE_DEFAULT = true;

var SETTINGS_INTERVAL_INACTIVITY = 'inactivity_interval';
var SETTINGS_INTERVAL_SAVE_STORAGE = 'interval_save_in_storage';
var SETTINGS_INTERVAL_RANGE = 'range_days';
var SETTINGS_VIEW_TIME_IN_BADGE = 'view_time_in_badge';

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function convertSummaryTimeToBadgeString(summaryTime) {
    var sec = (summaryTime);
    var min = (summaryTime / 60).toFixed(0);
    var hours = (summaryTime / (60 * 60)).toFixed(0);
    var days = (summaryTime / (60 * 60 * 24)).toFixed(0);

    if (sec < 60) {
        return sec + "s";
    } else if (min < 60) {
        return min + "m";
    } else if (hours < 24) {
        return hours + "h";
    } else {
        return days + "d"
    }
}

function convertSummaryTimeToString(summaryTime) {
    var days = Math.floor(summaryTime / 3600 / 24);
    var totalHours = summaryTime % (3600 * 24);
    var hours = Math.floor(totalHours / 3600);
    var totalSeconds = summaryTime % 3600;
    var mins = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    hours = zeroAppend(hours);
    mins = zeroAppend(mins);
    seconds = zeroAppend(seconds);

    if (days > 0)
        return days + 'd ' + hours + 'h ' + mins + 'm ' + seconds + 's';
    else return hours + 'h ' + mins + 'm ' + seconds + 's';
}

function zeroAppend(time) {
    if (time < 10)
        return '0' + time;
    else return time;
}

function isDateInRange(date, range){
    return date >= range.from && date <= range.to;
}
