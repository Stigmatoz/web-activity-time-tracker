'use strict';

var storage = new LocalStorage();
var ui = new UI();
var totalTime;
var tabsFromStorage;
var targetTabs;
var currentTypeOfList;
var today = new Date().toLocaleDateString();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnToday').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ToDay;
        ui.setUIForToday();
        getDataFromStorageToday();
    });
    document.getElementById('btnAll').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.All;
        ui.setUIForAll();
        getDataFromStorageAll();
    });
    document.getElementById('btnByDays').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ByDays;
        ui.setUIForByDays();
    });
});

firstInitPage();

function firstInitPage() {
    currentTypeOfList = TypeListEnum.ToDay;
    getDataFromStorageToday();
}

function getDataFromStorageToday() {
    storage.load(STORAGE_TABS, getTabsFromStorage);
}

function getDataFromStorageAll() {
    storage.load(STORAGE_TABS, getTabsFromStorage);
}

function getTabsFromStorage(tabs) {
    tabsFromStorage = tabs;
    targetTabs = [];

    var table = ui.getTableOfSite();
    ui.clearUI();

    if (currentTypeOfList === TypeListEnum.All) {
        targetTabs = tabs.sort(function (a, b) {
            return b.summaryTime - a.summaryTime;
        });

        totalTime = getTotalTime(targetTabs);
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
            ui.fillEmptyBlock();
            return;
        }
    }

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

        ui.addLineToTableOfSite(targetTabs[i], currentTab, summaryTime);

        if (i <= 5)
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