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
    second30: 30,
    second45: 45,
    min1: 60,
    min2: 120,
    min5: 300,
    min10: 600,
    min20: 1200,
    min30: 1800
};

var TypeListEnum = {
    ToDay: 1,
    All: 2,
    ByDays: 3,
};

var STORAGE_TABS = 'tabs';
var STORAGE_BLACK_LIST = 'black_list';
var STORAGE_RESTRICTION_LIST = 'restriction_list';

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

function convertTimeToSummaryTime(time) {
    var timeValue = time.split(':');
    var hour = timeValue[0];
    var min = timeValue[1];
    var resultTimeValue = 0;
    if (hour > 0)
        resultTimeValue = hour * 3600;
    resultTimeValue += min * 60;

    return resultTimeValue;
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

function convertShortSummaryTimeToString(summaryTime) {
    var hours = Math.floor(summaryTime / 3600);
    var totalSeconds = summaryTime % 3600;
    var mins = Math.floor(totalSeconds / 60);

    hours = zeroAppend(hours);
    mins = zeroAppend(mins);

    return hours + 'h ' + mins + 'm';
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

function isDateInRange(dateStr, range) {
    var arr = dateStr.split('.');
    var date = new Date(arr[2], arr[1] - 1, arr[0]);
    var from = getValueFromArrayRange(range.from);
    var to = getValueFromArrayRange(range.to);
    return date >= from && date <= to;
}

function getValueFromArrayRange(value) {
    var arr;
    if (value.indexOf('.') !== -1) {
        arr = value.split('.');
        return new Date(arr[2], arr[1] - 1, arr[0]);
    }
    if (value.indexOf('/') !== -1)
        arr = value.split('/');
    return new Date(arr[2], arr[0] - 1, arr[1]);
}

function convertToDate(date) {
    var arr = date.split('.');
    return new Date(arr[2], arr[1] - 1, arr[0]);
}

function getDateFromRange(range) {
    switch (range) {
        case 'days2': return 2;
        case 'days3': return 3;
        case 'days4': return 4;
        case 'days5': return 5;
        case 'days6': return 6;
        case 'days7': return 7;
        case 'month1': return 30;
        case 'month2': return 60;
        case 'month3': return 90;
    }
}
