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
        if (tabs[i].url == currentTab){
            spanUrl.classList.add('span-active-url');
        }

        var spanPercentage = document.createElement('span');
        spanPercentage.classList.add('span-percentage');
        spanPercentage.innerText = setPercentage(tabs[i].summaryTime);

        var spanTime = document.createElement('span');
        spanTime.classList.add('span-time');
        spanTime.innerText = convertSummaryTimeToString(tabs[i].summaryTime);

        div.appendChild(img);
        div.appendChild(spanUrl);
        div.appendChild(spanPercentage);
        div.appendChild(spanTime);
        table.appendChild(div);
    }
}

function setTotalTime(tabs) {
    var summaryTimeList = tabs.map(function (a) { return a.summaryTime; });
    var total = summaryTimeList.reduce(function (a, b) { return a + b; })
    document.getElementById('totalTime').innerText = convertSummaryTimeToString(total);

    return total;
}

function setPercentage(time){
    return ((time / totalTime) * 100).toFixed(2) + '%';
}

function getCurrentTab(){
    return chrome.extension.getBackgroundPage().currentTab;
}