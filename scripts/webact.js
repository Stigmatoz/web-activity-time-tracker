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
    storage.loadTabs(STORAGE_TABS, getTabsFromStorage);
}

function getDataFromStorageByDays() {
    storage.loadTabs(STORAGE_TABS, getTabsByDays);
}

function getLimitsListFromStorageCallback(items){
    if (items !== undefined)
        restrictionList = items;
    else restrictionList = [];
}

function getTabsFromStorage(tabs) {
    tabsFromStorage = tabs;
    targetTabs = [];

    ui.clearUI();
    if (tabs === null) {
        ui.fillEmptyBlock('chart');
        return;
    }

    if (currentTypeOfList === TypeListEnum.All) {
        targetTabs = tabs.sort(function (a, b) {
            return b.summaryTime - a.summaryTime;
        });

        if (targetTabs.length > 0){
            totalTime = getTotalTime(targetTabs);
        }
        else{
            ui.fillEmptyBlock('chart');
            return;
        }
    }
    if (currentTypeOfList === TypeListEnum.ToDay) {
        targetTabs = tabs.filter(x => x.days.find(s => s.date === today));
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
        ui.addTableHeader(currentTypeOfList, getFirstDay());
    if (currentTypeOfList === TypeListEnum.ToDay)
        ui.addTableHeader(currentTypeOfList);

    var currentTab = getCurrentTab();

    var tabsForChart = [];
    for (var i = 0; i < targetTabs.length; i++) {
        var summaryTime;
        if (currentTypeOfList === TypeListEnum.ToDay) {
            summaryTime = targetTabs[i].days.find(x => x.date == today).summary;
        }
        if (currentTypeOfList === TypeListEnum.All) {
            summaryTime = targetTabs[i].summaryTime;
        }

        ui.addLineToTableOfSite(targetTabs[i], currentTab, summaryTime, currentTypeOfList);

        if (i <= 8)
            addTabForChart(tabsForChart, targetTabs[i].url, summaryTime);
        else addTabOthersForChart(tabsForChart, summaryTime);
    }

    ui.addHrAfterTableOfSite();
    ui.createTotalBlock(totalTime);
    ui.drawChart(tabsForChart);
    ui.setActiveTooltipe(currentTab);
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

function addTabForChart(tabsForChart, url, time) {
    tabsForChart.push(
        {
            'url': url,
            'percentage': getPercentageForChart(time),
            'summary': time
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
    if (range.from !== 'Invalid Date' && range.to !== 'Invalid Date') {
        var listOfDays = [];
        tabs.map(function (a) {
            return a.days.map(function (a) {
                var item = listOfDays.find(x => x.date == a.date);
                if (item !== undefined) {
                    return item.total += a.summary;
                }
                if (item === undefined && isDateInRange(a.date, range))
                    return listOfDays.push({
                        'date': a.date,
                        'total': a.summary
                    });
            });
        });
        listOfDays = listOfDays.sort(function (a, b) {
            return convertToDate(a.date) - convertToDate(b.date);
        });

        ui.fillListOfDays(listOfDays);
    }
    else {
        ui.fillEmptyBlockForDays();
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
        var summaryTime;
        summaryTime = targetTabs[i].days.find(x => x.date == day).summary;

        ui.addLineToTableOfSite(targetTabs[i], currentTab, summaryTime, TypeListEnum.ByDays, blockName + '_content');
    }
}