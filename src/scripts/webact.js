'use strict';

var storage = new LocalStorage();
var ui = new UI();
var totalTime;
var tabsFromStorage;
var targetTabs;
var currentTypeOfList;
var today = new Date().toLocaleDateString();
var setting_range_days;
var restrictionList;

document.addEventListener('DOMContentLoaded', function () {
    storage.getSettings(SETTINGS_INTERVAL_RANGE, function (item) { setting_range_days = item; });
    document.getElementById('btnToday').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ToDay;
        ui.setUIForToday();
        getDataFromStorage();
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
    currentTypeOfList = TypeListEnum.ToDay;
    getLimitsListFromStorage();
    getDataFromStorage();
}

function getLimitsListFromStorage() {
    storage.loadTabs(STORAGE_RESTRICTION_LIST, getLimitsListFromStorageCallback);
}

function getDataFromStorage() {
    storage.loadTabs(STORAGE_TABS, getTabsFromStorage, fillEmptyBlock);
}

function getDataFromStorageByDays() {
    storage.loadTabs(STORAGE_TABS, getTabsByDays);
}

function getLimitsListFromStorageCallback(items) {
    if (items !== undefined)
        restrictionList = items;
    else restrictionList = [];
}

function fillEmptyBlock() {
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
        }
        else {
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
        }
        else {
            ui.fillEmptyBlock('chart');
            return;
        }
    }

    if (currentTypeOfList === TypeListEnum.All)
        ui.addTableHeader(currentTypeOfList, counterOfSite, getFirstDay());
    if (currentTypeOfList === TypeListEnum.ToDay)
        ui.addTableHeader(currentTypeOfList, counterOfSite);

    var currentTab = getCurrentTab();

    var tabsForChart = [];
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

        if (currentTypeOfList === TypeListEnum.ToDay || (currentTypeOfList === TypeListEnum.All && i <= 30))
            ui.addLineToTableOfSite(targetTabs[i], currentTab, summaryTime, currentTypeOfList, counter);
        else
            ui.addExpander();

        if (i <= 8)
            addTabForChart(tabsForChart, targetTabs[i].url, summaryTime, counter);
        else addTabOthersForChart(tabsForChart, summaryTime);
    }

    ui.addHrAfterTableOfSite();
    ui.createTotalBlock(totalTime);
    ui.drawChart(tabsForChart);
    ui.setActiveTooltipe(currentTab);
}

function getTabsForExpander() {
    storage.loadTabs(STORAGE_TABS, getTabsFromStorageForExpander);
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
    return ((time / totalTime) * 100).toFixed(2) + '%';
}

function getPercentageForChart(time) {
    return ((time / totalTime) * 100).toFixed(2) / 100;
}

function getCurrentTab() {
    return chrome.extension.getBackgroundPage().currentTab;
}

function addTabForChart(tabsForChart, url, time, counter) {
    tabsForChart.push(
        {
            'url': url,
            'percentage': getPercentageForChart(time),
            'summary': time,
            'visits': counter
        }
    );
}

function addTabOthersForChart(tabsForChart, summaryTime) {
    var tab = tabsForChart.find(x => x.url == 'Others');
    if (tab === undefined) {
        tabsForChart.push(
            {
                'url': 'Others',
                'percentage': getPercentageForChart(summaryTime),
                'summary': summaryTime
            }
        );
    }
    else {
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

    return {
        'countOfDays': array.length,
        'minDate': array[0]
    };
}

function getTabsByDays(tabs) {
    var range = ui.getDateRange();
    if (tabs === undefined) {
        ui.fillEmptyBlockForDays();
        return;
    }
    if (range.from !== 'Invalid Date' && range.to !== 'Invalid Date') {
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

        var getDaysArray = function(start, end) {
            let first = new Date(start);
            let second = new Date(end);
            var arr = [];
            for (let i = first; i <= second; i = new Date(i.setDate(i.getDate() + 1))){
                arr.push(new Date(i).toLocaleDateString());
            }
            return arr;
        };
        ui.fillListOfDays(listOfDays, getDaysArray(getDateValueFromString(range.from), getDateValueFromString(range.to)));
    }
    else {
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
    }
    else {
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