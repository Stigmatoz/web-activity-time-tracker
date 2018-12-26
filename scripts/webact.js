'use strict';

var storage = new LocalStorage();

getDataFromStorage();

function getDataFromStorage() {
    storage.load(STORAGE_TABS, getTabsFromStorage);
}

function getTabsFromStorage(tabs) {
    var table = document.getElementById('resultTable');
    table.innerHTML = null;
    tabs = tabs.sort(function(a, b){
        return b.summaryTime - a.summaryTime;
    });
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

        var spanTime = document.createElement('span');
        spanTime.classList.add('span-time');
        spanTime.innerText = convertSummaryTimeToString(tabs[i].summaryTime);

        div.appendChild(img);
        div.appendChild(spanUrl);
        div.appendChild(spanTime);
        table.appendChild(div);
    }
}