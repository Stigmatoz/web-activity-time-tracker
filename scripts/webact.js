'use strict';

var storage = new LocalStorage();
var totalTime;

getDataFromStorage();

function getDataFromStorage() {
    storage.load(STORAGE_TABS, getTabsFromStorage);
}

function getTabsFromStorage(tabs) {
    var table = document.getElementById('resultTable');
    table.innerHTML = null;
    tabs = tabs.sort(function (a, b) {
        return b.summaryTime - a.summaryTime;
    });

    totalTime = setTotalTime(tabs);

    var currentTab = getCurrentTab();

    var tabsForChart = [];
    for (var i = 0; i < tabs.length; i++) {
        var div = document.createElement('div');
        div.classList.add('inline-flex');

        var img = document.createElement('img');
        img.classList.add('favicon');
        img.setAttribute('height', 15);
        img.setAttribute('src', tabs[i].favicon);

        var spanUrl = document.createElement('span');
        spanUrl.classList.add('span-url');
        spanUrl.innerText = tabs[i].url;
        if (tabs[i].url == currentTab) {
            spanUrl.classList.add('span-active-url');
        }

        var spanPercentage = document.createElement('span');
        spanPercentage.classList.add('span-percentage');
        spanPercentage.innerText = getPercentage(tabs[i].summaryTime);

        if (i <= 5)
            addTabForChart(tabsForChart, tabs[i].url, tabs[i].summaryTime);
        else addTabOthersForChart(tabsForChart, tabs[i].summaryTime);

        var spanTime = document.createElement('span');
        spanTime.classList.add('span-time');
        spanTime.innerText = convertSummaryTimeToString(tabs[i].summaryTime);

        div.appendChild(img);
        div.appendChild(spanUrl);
        div.appendChild(spanPercentage);
        div.appendChild(spanTime);
        table.appendChild(div);
    }

    drawChart(tabsForChart);
    setActiveTooltipe(currentTab);
}

function setTotalTime(tabs) {
    var summaryTimeList = tabs.map(function (a) { return a.summaryTime; });
    var total = summaryTimeList.reduce(function (a, b) { return a + b; })
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
        tab['summary'] = tab['summary'] + summaryTime;
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

function setActiveTooltipe(currentTab){
    var event = new Event("mouseenter");
    document.getElementById(currentTab).dispatchEvent(event);
}