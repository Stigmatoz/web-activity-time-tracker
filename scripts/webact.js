'use strict';

var storage = new LocalStorage();
var totalTime;
var tabsFromStorage;
var donut;
var targetTabs;
var currentTypeOfList;
var today = new Date().toLocaleDateString();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnToday').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ToDay;
        setUIForToday();
        getDataFromStorageToday();
    });
    document.getElementById('btnAll').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.All;
        setUIForAll();
        getDataFromStorageAll();
    });
    document.getElementById('btnByDays').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ByDays;
        setUIForByDays();
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

function setUIForToday() {
    document.getElementById('btnToday').classList.add('active');
    document.getElementById('btnAll').classList.remove('active');
    document.getElementById('btnByDays').classList.remove('active');
}

function setUIForAll() {
    document.getElementById('btnAll').classList.add('active');
    document.getElementById('btnToday').classList.remove('active');
    document.getElementById('btnByDays').classList.remove('active');
}

function setUIForByDays() {
    document.getElementById('btnByDays').classList.add('active');
    document.getElementById('btnAll').classList.remove('active');
    document.getElementById('btnToday').classList.remove('active');

    document.getElementById('resultTable').innerHTML = null;
    document.getElementById('chart').innerHTML = null;
}

function clearUI(){
    document.getElementById('resultTable').innerHTML = null;
    document.getElementById('chart').innerHTML = null;
    document.getElementById('total').innerHTML = null;
}

function getTabsFromStorage(tabs) {
    tabsFromStorage = tabs;
    targetTabs = [];

    var table = document.getElementById('resultTable');
    clearUI();

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
            document.getElementById('chart').innerHTML = '<p class="no-data">No data</p>';
            return;
        }
    }

    var currentTab = getCurrentTab();

    var tabsForChart = [];
    for (var i = 0; i < targetTabs.length; i++) {
        var div = document.createElement('div');
        div.classList.add('inline-flex');

        var img = document.createElement('img');
        img.classList.add('favicon');
        img.setAttribute('height', 15);
        img.setAttribute('src', targetTabs[i].favicon);

        var spanUrl = document.createElement('span');
        spanUrl.classList.add('span-url');
        spanUrl.innerText = targetTabs[i].url;
        if (targetTabs[i].url == currentTab) {
            spanUrl.classList.add('span-active-url');
        }

        var summaryTime;
        if (currentTypeOfList === TypeListEnum.ToDay) {
            summaryTime = targetTabs[i].days.find(x => x.date == today).summary;
        }
        if (currentTypeOfList === TypeListEnum.All) {
            summaryTime = targetTabs[i].summaryTime;
        }

        var spanPercentage = document.createElement('span');
        spanPercentage.classList.add('span-percentage');
        spanPercentage.innerText = getPercentage(summaryTime);

        if (i <= 5)
            addTabForChart(tabsForChart, targetTabs[i].url, summaryTime);
        else addTabOthersForChart(tabsForChart, summaryTime);

        var spanTime = document.createElement('span');
        spanTime.classList.add('span-time');
        spanTime.innerText = convertSummaryTimeToString(summaryTime);

        div.appendChild(img);
        div.appendChild(spanUrl);
        div.appendChild(spanPercentage);
        div.appendChild(spanTime);
        table.appendChild(div);
    }

    table.appendChild(document.createElement('hr'));
    addTotalBlock();
    drawChart(tabsForChart);
    setActiveTooltipe(currentTab);
}

function addTotalBlock(table){
    var totalElement = document.getElementById('total');

    var spanTitle = document.createElement('span');
    spanTitle.classList.add('span-total');
    spanTitle.innerHTML = 'Total';

    var spanTime = document.createElement('span');
    spanTime.classList.add('span-time');
    spanTime.innerHTML = convertSummaryTimeToString(totalTime);

    totalElement.appendChild(spanTitle);
    totalElement.appendChild(spanTime);
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

function drawChart(tabs) {
    donut = donutChart()
        .width(480)
        .height(280)
        .cornerRadius(5) // sets how rounded the corners are on each slice
        .padAngle(0.020) // effectively dictates the gap between slices
        .variable('percentage')
        .category('url');

    d3.select('#chart')
        .datum(tabs) // bind data to the div
        .call(donut); // draw chart in div

    document.getElementById('chart').appendChild(document.createElement('hr'));
}

function setActiveTooltipe(currentTab) {
    if (currentTab !== '') {
        var element = document.getElementById(currentTab);
        if (element !== null) {
            var event = new Event("mouseenter");
            document.getElementById(currentTab).dispatchEvent(event);
        }
        //     var currentInfoForTab;
        //     if (currentTypeOfList === TypeListEnum.ToDay) {
        //         currentInfoForTab = targetTabs.find(x => x.url === currentTab).days.find(x => x.date === today)
        //     }
    }
}