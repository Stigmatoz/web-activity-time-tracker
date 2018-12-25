var storage = new LocalStorage();

setInterval(getDataFromStorage, SETTINGS_INTERVAL_CHECK_STORAGE);

function getDataFromStorage() {
    var currentTabs = storage.load(STORAGE_TABS);
    if (currentTabs !== undefined && currentTabs.length > 0)
        getTabsFromStorage(currentTabs);
}

function getTabsFromStorage(tabs) {
    var table = document.getElementById('resultTable');
    table.innerHTML = null;
    for (var i = 0; i < tabs.length; i++) {
        var div = document.createElement('div');
        div.classList.add('inline-flex');

        var img = document.createElement('img');
        img.setAttribute('height', 15);
        img.setAttribute('src', tabs[i].favicon);

        var span = document.createElement('span');
        span.innerText = tabs[i].url + ' ' + convertSummaryTimeToString(tabs[i].summaryTime);
        span.classList.add('margin-left-5');

        div.appendChild(img);
        div.appendChild(span);
        table.appendChild(div);
    }
}