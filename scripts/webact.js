'use strict';

var storage = new LocalStorage();
var totalTime;
var tabsFromStorage;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnToday').addEventListener('click', function () {
        document.getElementById('btnToday').classList.add('active');
        document.getElementById('btnAll').classList.remove('active');
        document.getElementById('btnByDays').classList.remove('active');
        getDataFromStorageToday();
    });
    document.getElementById('btnAll').addEventListener('click', function () {
        document.getElementById('btnAll').classList.add('active');
        document.getElementById('btnToday').classList.remove('active');
        document.getElementById('btnByDays').classList.remove('active');
        getDataFromStorageAll();
    });
    document.getElementById('btnByDays').addEventListener('click', function () {
        document.getElementById('btnByDays').classList.add('active');
        document.getElementById('btnAll').classList.remove('active');
        document.getElementById('btnToday').classList.remove('active');

        document.getElementById('resultTable').innerHTML = null;
        document.getElementById('chart').innerHTML = null;
    });
});

getDataFromStorageToday();

function getDataFromStorageToday() {
    storage.load(STORAGE_TABS, getTabsFromStorage);
}

function getDataFromStorageAll() {
    storage.load(STORAGE_TABS, getTabsFromStorage, true);
}

function getTabsFromStorage(tabs, options) {
    tabsFromStorage = tabs;
    var targetTabs = [];

    var table = document.getElementById('resultTable');
    table.innerHTML = null;
    document.getElementById('chart').innerHTML = null;

    if (options !== undefined && options === true) {
        targetTabs = tabs.sort(function (a, b) {
            return b.summaryTime - a.summaryTime;
        });

        totalTime = setTotalTime(targetTabs);
    } else {
        var today = new Date().toLocaleDateString();

        targetTabs = tabs.filter(x => x.days.find(s => s.date === today));
        targetTabs = targetTabs.sort(function (a, b) {
            return b.days.find(s => s.date === today) - a.days.find(s => s.date === today);
        });

        totalTime = setTotalTime(targetTabs, today);
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
        if (today !== undefined) {
            summaryTime = targetTabs[i].days.find(x => x.date == today).summary;
        } else {
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

    drawChart(tabsForChart);
    setActiveTooltipe(currentTab);
}

function setTotalTime(tabs, today) {
    var total;
    if (today !== undefined) {
        var summaryTimeList = tabs.map(function (a) { return a.days.find(s => s.date === today).summary; });
        total = summaryTimeList.reduce(function (a, b) { return a + b; })
    } else {
        var summaryTimeList = tabs.map(function (a) { return a.summaryTime; });
        total = summaryTimeList.reduce(function (a, b) { return a + b; })
    }
    document.getElementById('totalTime').innerText = convertSummaryTimeToString(total);

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
    var donut = donutChart()
        .width(480)
        .height(280)
        .cornerRadius(5) // sets how rounded the corners are on each slice
        .padAngle(0.020) // effectively dictates the gap between slices
        .variable('percentage')
        .category('url');

    d3.select('#chart')
        .datum(tabs) // bind data to the div
        .call(donut); // draw chart in div
}

function setActiveTooltipe(currentTab) {
    if (currentTab !== '') {
        var event = new Event("mouseenter");
        document.getElementById(currentTab).dispatchEvent(event);
    }
}