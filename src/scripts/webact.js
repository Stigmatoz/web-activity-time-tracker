'use strict';

var tabsFromBackground;
var storage = new LocalStorage();
var ui = new UI();
var totalTime, averageTime;
var tabsFromStorage;
var targetTabs;
var currentTypeOfList;
var today = new Date().toLocaleDateString();
var setting_range_days;
var setting_dark_mode;
var restrictionList;
var stat = {
    set firstDay(value) {
        document.getElementById('statFirstDay').innerHTML = value;
    },
    set activeDays(value) {
        document.getElementById('statActiveDays').innerHTML = value;
    },
    set totalDays(value) {
        document.getElementById('statTotalDays').innerHTML = value;
    },
    set inActiveDay(value) {
        document.getElementById('statInActiveDay').innerHTML = value;
        this.inActiveDayValue = value;
    },
    get inActiveDay() {
        return this.inActiveDayValue;
    },
    set inActiveDayWithoutCurrentDay(value) {
        document.getElementById('statInActiveDayWithoutCurrentDay').innerHTML = value;
        this.inActiveDayWithoutCurrentDayValue = value;
    },
    get inActiveDayWithoutCurrentDay() {
        return this.inActiveDayWithoutCurrentDayValue;
    },
    set inActiveDayTime(value) {
        document.getElementById('statInActiveDayTime').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statInActiveDayTime'));
        this.inActiveDayTimeValue = value;
    },
    get inActiveDayTime() {
        return this.inActiveDayTimeValue;
    },
    set inActiveDayTimeWithoutCurrentDay(value) {
        document.getElementById('statInActiveDayTimeWithoutCurrentDay').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statInActiveDayTimeWithoutCurrentDay'));
        this.inActiveDayTimeWithoutCurrentDayValue = value;
    },
    get inActiveDayTimeWithoutCurrentDay() {
        return this.inActiveDayTimeWithoutCurrentDayValue;
    },
    set activeDay(value) {
        document.getElementById('statActiveDay').innerHTML = value;
    },
    set activeDayWithoutCurrentDay(value) {
        document.getElementById('statActiveDayWithoutCurrentDay').innerHTML = value;
    },
    set averageTime(value) {
        document.getElementById('statAverageTime').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statAverageTime'));
    },
    set activeDayTime(value) {
        document.getElementById('statActiveDayTime').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statActiveDayTime'));
    },
    set activeDayTimeWithoutCurrentDay(value) {
        document.getElementById('statActiveDayTimeWithoutCurrentDay').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statActiveDayTimeWithoutCurrentDay'));
    },
    set todayTime(value) {
        document.getElementById('statTodayTime').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statTodayTime'));
    },
    set allDaysTime(value) {
        document.getElementById('statAllDaysTime').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.All, document.getElementById('statAllDaysTime'));
    },
};

document.addEventListener('DOMContentLoaded', function () {
    ui.setPreloader();

    storage.getValue(SETTINGS_INTERVAL_RANGE, function (item) { setting_range_days = item; });
    document.getElementById('btnToday').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ToDay;
        ui.setUIForToday();
        getDataFromStorage();
    });
    document.getElementById('donutChartBtn').addEventListener('click', function () {
        ui.setUIForDonutChart();
        getDataFromStorage();
    });
    document.getElementById('heatMapChartBtn').addEventListener('click', function () {
        ui.setUIForTimeChart();
        getTimeIntervalList();
    });
    document.getElementById('btnAll').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.All;
        ui.setUIForAll();
        getDataFromStorage();
    });
    document.getElementById('btnByDays').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ByDays;
        ui.setUIForByDays(setting_range_days);
        getDataFromStorageByDays();
    });
    document.getElementById('statInActiveDayIcon').addEventListener('click', function () {
        fillBlockWithInActiveDay();
    });
    document.getElementById('statActiveDayIcon').addEventListener('click', function () {
        fillBlockWithActiveDay();
    });
    document.getElementById('closeHintBtn').addEventListener('click', function () {
        document.getElementById('hintForUsers').classList.add('hide');
        storage.saveValue(SETTINGS_SHOW_HINT, false);
    });
    document.getElementById('settings').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
});

firstInitPage();

function firstInitPage() {
    chrome.runtime.getBackgroundPage(function (bg) {
        setting_dark_mode = bg.setting_dark_mode;
        ui.setMode();
        tabsFromBackground = bg.tabs;
        currentTypeOfList = TypeListEnum.ToDay;
        getLimitsListFromStorage();
        getDataFromStorage();
        storage.getValue(SETTINGS_SHOW_HINT, function (item) {
            if (item)
                document.getElementById('hintForUsers').classList.remove('hide');
        });
    });
}

window.addEventListener('click', function (e) {
    if (e.target.nodeName == 'SPAN' && e.target.className == 'span-url' && e.target.attributes.href.value != undefined){
        chrome.tabs.create({ url: e.target.attributes.href.value })
    }
});

function getLimitsListFromStorage() {
    storage.loadTabs(STORAGE_RESTRICTION_LIST, getLimitsListFromStorageCallback);
}

function getDataFromStorage() {
    if (tabsFromBackground != undefined && tabsFromBackground != null && tabsFromBackground.length > 0)
        getTabsFromStorage(tabsFromBackground);
    else fillEmptyBlock();
}

function getDataFromStorageByDays() {
    if (tabsFromBackground != undefined && tabsFromBackground != null && tabsFromBackground.length > 0)
        getTabsByDays(tabsFromBackground);
}

function getLimitsListFromStorageCallback(items) {
    if (items !== undefined)
        restrictionList = items;
    else restrictionList = [];
}

function fillEmptyBlock() {
    ui.removePreloader();
    ui.fillEmptyBlock('chart');
}

function getTabsFromStorage(tabs) {
    tabsFromStorage = tabs;
    targetTabs = [];

    ui.clearUI();
    if (tabs === null) {
        ui.fillEmptyBlock('chart');
        return;
    }

    var counterOfSite;
    if (currentTypeOfList === TypeListEnum.All) {
        targetTabs = tabs.sort(function (a, b) {
            return b.summaryTime - a.summaryTime;
        });

        if (targetTabs.length > 0) {
            totalTime = getTotalTime(targetTabs);
            stat.allDaysTime = totalTime;

        } else {
            ui.fillEmptyBlock('chart');
            return;
        }

        counterOfSite = tabs.length;
    }
    if (currentTypeOfList === TypeListEnum.ToDay) {
        targetTabs = tabs.filter(x => x.days.find(s => s.date === today));
        counterOfSite = targetTabs.length;
        if (targetTabs.length > 0) {
            targetTabs = targetTabs.sort(function (a, b) {
                return b.days.find(s => s.date === today).summary - a.days.find(s => s.date === today).summary;
            });

            totalTime = getTotalTime(targetTabs);
            stat.todayTime = totalTime;
        } else {
            ui.fillEmptyBlock('chart');
            return;
        }
    }

    if (currentTypeOfList === TypeListEnum.All)
        ui.addTableHeader(currentTypeOfList, counterOfSite, totalTime, getFirstDay());
    if (currentTypeOfList === TypeListEnum.ToDay)
        ui.addTableHeader(currentTypeOfList, counterOfSite, totalTime);

    var currentTab = getCurrentTab();

    var tabsForChart = [];
    var summaryCounter = 0;
    for (var i = 0; i < targetTabs.length; i++) {
        var summaryTime;
        var counter;
        if (currentTypeOfList === TypeListEnum.ToDay) {
            summaryTime = targetTabs[i].days.find(x => x.date == today).summary;
            if (targetTabs[i].days.find(x => x.date == today))
                counter = targetTabs[i].days.find(x => x.date == today).counter;
        }
        if (currentTypeOfList === TypeListEnum.All) {
            summaryTime = targetTabs[i].summaryTime;
            counter = targetTabs[i].counter;
        }

        summaryCounter += counter;

        if (currentTypeOfList === TypeListEnum.ToDay || (currentTypeOfList === TypeListEnum.All && i <= 30))
            ui.addLineToTableOfSite(targetTabs[i], currentTab, summaryTime, currentTypeOfList, counter);
        else
            ui.addExpander();

        if (i <= 8)
            addTabForChart(tabsForChart, targetTabs[i].url, summaryTime, counter);
        else addTabOthersForChart(tabsForChart, summaryTime);
    }

    ui.addHrAfterTableOfSite();
    ui.createTotalBlock(totalTime, currentTypeOfList, summaryCounter);
    ui.drawChart(tabsForChart);
    ui.setActiveTooltipe(currentTab);

    ui.removePreloader();
}

function getTabsForTimeChart(timeIntervals) {
    var resultArr = [];
    if (timeIntervals != undefined) {
        timeIntervals.forEach(function (data) {
            if (data.day == today) {
                data.intervals.forEach(function (interval) {
                    resultArr.push({ 'domain': data.domain, 'interval': interval });
                });
            }
        });
    }
    return resultArr;
}

function getTabsForExpander() {
    if (tabsFromBackground != undefined && tabsFromBackground != null && tabsFromBackground.length > 0)
        getTabsFromStorageForExpander(tabsFromBackground);
}

function getTimeIntervalList() {
    storage.getValue(STORAGE_TIMEINTERVAL_LIST, drawTimeChart);
}

function drawTimeChart(items) {
    ui.drawTimeChart(getTabsForTimeChart(items));
}

function getTabsFromStorageForExpander(tabs) {
    tabsFromStorage = tabs;
    targetTabs = [];

    targetTabs = tabs.sort(function (a, b) {
        return b.summaryTime - a.summaryTime;
    });

    var currentTab = getCurrentTab();

    for (var i = 31; i < targetTabs.length; i++) {
        var summaryTime;
        var counter;
        if (currentTypeOfList === TypeListEnum.ToDay) {
            summaryTime = targetTabs[i].days.find(x => x.date == today).summary;
            if (targetTabs[i].days.find(x => x.date == today))
                counter = targetTabs[i].days.find(x => x.date == today).counter;
        }
        if (currentTypeOfList === TypeListEnum.All) {
            summaryTime = targetTabs[i].summaryTime;
            counter = targetTabs[i].counter;
        }

        ui.addLineToTableOfSite(targetTabs[i], currentTab, summaryTime, currentTypeOfList, counter);
    }

    var table = ui.getTableOfSite();
    table.removeChild(table.getElementsByTagName('hr')[0]);
    ui.addHrAfterTableOfSite();
}

function getTotalTime(tabs) {
    var total;
    if (currentTypeOfList === TypeListEnum.ToDay) {
        var summaryTimeList = tabs.map(function (a) { return a.days.find(s => s.date === today).summary; });
        total = summaryTimeList.reduce(function (a, b) { return a + b; })
    }
    if (currentTypeOfList === TypeListEnum.All) {
        var summaryTimeList = tabs.map(function (a) { return a.summaryTime; });
        total = summaryTimeList.reduce(function (a, b) { return a + b; })
    }
    return total;
}

function getTotalTimeForDay(day, tabs) {
    var total;
    var summaryTimeList = tabs.map(function (a) { return a.days.find(s => s.date === day).summary; });
    total = summaryTimeList.reduce(function (a, b) { return a + b; })
    return total;
}

function getPercentage(time) {
    return ((time / totalTime) * 100).toFixed(2) + ' %';
}

function getPercentageForChart(time) {
    return ((time / totalTime) * 100).toFixed(2) / 100;
}

function getCurrentTab() {
    return chrome.extension.getBackgroundPage().currentTab;
}

function addTabForChart(tabsForChart, url, time, counter) {
    tabsForChart.push({
        'url': url,
        'percentage': getPercentageForChart(time),
        'summary': time,
        'visits': counter
    });
}

function addTabOthersForChart(tabsForChart, summaryTime) {
    var tab = tabsForChart.find(x => x.url == 'Others');
    if (tab === undefined) {
        tabsForChart.push({
            'url': 'Others',
            'percentage': getPercentageForChart(summaryTime),
            'summary': summaryTime
        });
    } else {
        tab['summary'] += summaryTime;
        tab['percentage'] = getPercentageForChart(tab['summary']);
    }
}

function getFirstDay() {
    var array = [];
    tabsFromStorage.map(function (a) {
        return a.days.map(function (a) {
            if (array.indexOf(a.date) === -1)
                return array.push(a.date);
        });
    });

    array = array.sort(function (a, b) {
        return new Date(a) - new Date(b);
    });

    setStatData(array);
    return {
        'countOfDays': array.length,
        'minDate': array[0]
    };
}

function setStatData(array) {
    var arrayAscByTime = [];
    var arrayAscByTimeWithoutCurrentDay = [];
    tabsFromStorage.forEach(tab => {
        return tab.days.forEach(day => {
            var item = arrayAscByTime.find(x => x.date == day.date);
            if (item !== undefined) {
                return item.total += day.summary;
            }
            if (item === undefined)
                return arrayAscByTime.push({
                    'date': day.date,
                    'total': day.summary
                });
        });
    });

    arrayAscByTimeWithoutCurrentDay = arrayAscByTime.filter(function (item) {
        return item.date != today;
    })

    arrayAscByTime = arrayAscByTime.sort(function (a, b) {
        return a.total - b.total;
    });

    arrayAscByTimeWithoutCurrentDay = arrayAscByTimeWithoutCurrentDay.sort(function (a, b) {
        return a.total - b.total;
    });

    stat.inActiveDay = new Date(arrayAscByTime[0].date).toLocaleDateString();
    stat.activeDay = new Date(arrayAscByTime[arrayAscByTime.length - 1].date).toLocaleDateString();
    stat.inActiveDayTime = arrayAscByTime[0].total;
    stat.activeDayTime = arrayAscByTime[arrayAscByTime.length - 1].total;

    //exclude current day from summary statistics 
    if (arrayAscByTimeWithoutCurrentDay.length > 0) {
        stat.inActiveDayWithoutCurrentDay = new Date(arrayAscByTimeWithoutCurrentDay[0].date).toLocaleDateString();
        stat.activeDayWithoutCurrentDay = new Date(arrayAscByTimeWithoutCurrentDay[arrayAscByTimeWithoutCurrentDay.length - 1].date).toLocaleDateString();
        stat.inActiveDayTimeWithoutCurrentDay = arrayAscByTimeWithoutCurrentDay[0].total;
        stat.activeDayTimeWithoutCurrentDay = arrayAscByTimeWithoutCurrentDay[arrayAscByTimeWithoutCurrentDay.length - 1].total;
    }
    else {
        stat.activeDayWithoutCurrentDay = 'No data';
        stat.inActiveDayWithoutCurrentDay = 'No data';
    }

    stat.firstDay = new Date(array[0]).toLocaleDateString();
    stat.activeDays = array.length;
    stat.averageTime = Math.round(totalTime / array.length);
    stat.totalDays = daysBetween(array[0], array[array.length - 1]);
}

function getTabsByDays(tabs) {
    var range = ui.getDateRange();
    if (tabs === undefined) {
        ui.fillEmptyBlockForDays();
        return;
    }
    if (range.from !== 'Invalid Date' && range.to !== 'Invalid Date' && isCorrectDate(range)) {
        var listOfDays = [];
        tabs.forEach(tab => {
            return tab.days.forEach(day => {
                var item = listOfDays.find(x => x.date == day.date);
                if (item !== undefined) {
                    return item.total += day.summary;
                }
                if (item === undefined && isDateInRange(day.date, range))
                    return listOfDays.push({
                        'date': day.date,
                        'total': day.summary
                    });
            });
        });
        listOfDays = listOfDays.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        var getDaysArray = function (start, end) {
            let first = start;
            let second = end;
            var arr = [];
            for (let i = first; i <= second; i = new Date(i.setDate(i.getDate() + 1))) {
                arr.push(new Date(i).toLocaleDateString());
            }
            return arr;
        };
        ui.fillListOfDays(listOfDays, getDaysArray(range.from, range.to));
    } else {
        ui.fillEmptyBlockForDaysIfInvalid();
    }
}

function getTabsFromStorageByDay(day, blockName) {
    targetTabs = [];

    if (tabsFromStorage === null) {
        ui.fillEmptyBlock(blockName);
        return;
    }

    targetTabs = tabsFromStorage.filter(x => x.days.find(s => s.date === day));
    if (targetTabs.length > 0) {
        targetTabs = targetTabs.sort(function (a, b) {
            return b.days.find(s => s.date === day).summary - a.days.find(s => s.date === day).summary;
        });

        totalTime = getTotalTimeForDay(day, targetTabs);
    } else {
        ui.fillEmptyBlock(blockName);
        return;
    }

    var currentTab = getCurrentTab();

    var content = document.createElement('div');
    content.classList.add('content-inner');
    content.id = blockName + '_content';
    document.getElementById(blockName).appendChild(content);
    for (var i = 0; i < targetTabs.length; i++) {
        var summaryTime, counter;
        summaryTime = targetTabs[i].days.find(x => x.date == day).summary;
        counter = targetTabs[i].days.find(x => x.date == day).counter;

        ui.addLineToTableOfSite(targetTabs[i], currentTab, summaryTime, TypeListEnum.ByDays, counter, blockName + '_content');
    }
}

function fillBlockWithInActiveDay() {
    var flag = document.getElementById('statInActiveDayIcon').dataset.today;
    if (flag == 'true')
        fillValuesForBlockWithInActiveDay("statInActiveDay", stat.inActiveDayWithoutCurrentDay, stat.inActiveDayTimeWithoutCurrentDay, flag);
    else
        fillValuesForBlockWithInActiveDay("statInActiveDay", stat.inActiveDay, stat.inActiveDayTime, flag);
}

function fillBlockWithActiveDay() {
    var flag = document.getElementById('statActiveDayIcon').dataset.today;
    if (flag == 'true')
        fillValuesForBlockWithInActiveDay("statActiveDay", stat.activeDayWithoutCurrentDay, stat.activeDayTimeWithoutCurrentDay, flag);
    else
        fillValuesForBlockWithInActiveDay("statActiveDay", stat.activeDay, stat.activeDayTime, flag);
}

function fillValuesForBlockWithInActiveDay(prefix, dayValue, timeValue, flag) {
    if (flag == 'true') {
        document.getElementById(prefix).classList.add('hide');
        document.getElementById(prefix + 'Time').classList.add('hide');
        document.getElementById(prefix + 'WithoutCurrentDay').classList.remove('hide');
        document.getElementById(prefix + 'TimeWithoutCurrentDay').classList.remove('hide');

        document.getElementById(prefix + 'Title').innerHTML = 'Include the current day in the calculation of statistics';
        document.getElementById(prefix + 'Icon').dataset.today = false;
        document.getElementById(prefix + 'Icon').src = "/icons/no-today.svg";

        document.getElementById(prefix + 'WithoutCurrentDay').value = dayValue;
        document.getElementById(prefix + 'TimeWithoutCurrentDay').value = timeValue;
    }
    else {
        document.getElementById(prefix).classList.remove('hide');
        document.getElementById(prefix + 'Time').classList.remove('hide');
        document.getElementById(prefix + 'WithoutCurrentDay').classList.add('hide');
        document.getElementById(prefix + 'TimeWithoutCurrentDay').classList.add('hide');

        document.getElementById(prefix + 'Title').innerHTML = "Don't Include the current day in the calculation of statistics";
        document.getElementById(prefix + 'Icon').dataset.today = true;
        document.getElementById(prefix + 'Icon').src = "/icons/today.svg";

        document.getElementById(prefix).value = dayValue;
        document.getElementById(prefix + 'Time').value = timeValue;
    }
}