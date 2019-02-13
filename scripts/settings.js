var storage = new LocalStorage();
var blackList = [];

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settingsBtn').addEventListener('click', function () {
        document.getElementById('settingsBtn').classList.add('active');
        document.getElementById('aboutBtn').classList.remove('active');

        document.getElementById('settingsBlock').hidden = false;
        document.getElementById('aboutBlock').hidden = true;
    });
    document.getElementById('aboutBtn').addEventListener('click', function () {
        document.getElementById('settingsBtn').classList.remove('active');
        document.getElementById('aboutBtn').classList.add('active');

        document.getElementById('settingsBlock').hidden = true;
        document.getElementById('aboutBlock').hidden = false;
    });
    document.getElementById('clearAllData').addEventListener('click', function () {
        clearAllData();
    });
    document.getElementById('addBlackSiteBtn').addEventListener('click', function () {
        addNewBlackSiteClickHandler();
    });
    document.getElementById('viewTimeInBadge').addEventListener('change', function () {
        storage.saveSettings(SETTINGS_VIEW_TIME_IN_BADGE, this.checked);
    });
    document.getElementById('intervalInactivity').addEventListener('change', function () {
        storage.saveSettings(SETTINGS_INTERVAL_INACTIVITY, this.value);
    });
    document.getElementById('rangeToDays').addEventListener('change', function () {
        storage.saveSettings(SETTINGS_INTERVAL_RANGE, this.value);
    });
});

loadSettings();

function loadSettings() {
    storage.getSettings(SETTINGS_INTERVAL_INACTIVITY, function (item) {
        document.getElementById('intervalInactivity').value = item;
    });
    storage.getSettings(SETTINGS_INTERVAL_RANGE, function (item) {
        document.getElementById('rangeToDays').value = item;
    });
    storage.getSettings(SETTINGS_VIEW_TIME_IN_BADGE, function (item) {
        document.getElementById('viewTimeInBadge').setAttribute('checked', item);
    });
    storage.getMemoryUse(STORAGE_TABS, function (integer) {
        document.getElementById('memoryUse').innerHTML = (integer / 1024).toFixed(2) + 'Kb';
    });
    storage.getSettings(STORAGE_BLACK_LIST, function (items) {
        blackList = items;
        viewBlackList(items);
    });
}

function viewBlackList(items) {
    if (items !== undefined) {
        for (var i = 0; i < items.length; i++) {
            addDomainToListBox(items[i]);
        }
    }
}

function clearAllData() {
    var tabs = [];
    chrome.extension.getBackgroundPage().tabs = tabs;
    storage.saveTabs(tabs, viewNotify);
}

function viewNotify() {
    document.getElementById('notify').hidden = false;
    setTimeout(function () { document.getElementById('notify').hidden = true; }, 3000);
}

function addNewBlackSiteClickHandler() {
    var newBlackSite = document.getElementById('addBlackSiteLbl').value;
    if (newBlackSite !== '') {
        addDomainToListBox(newBlackSite);
        blackList.push(newBlackSite);
        document.getElementById('addBlackSiteLbl').value = '';
    }
    updateBlackList();
}

function addDomainToListBox(domain) {
    var li = document.createElement('li');
    li.innerText = domain;
    var del = document.createElement('img');
    del.height = 12;
    del.src = '/icons/delete.png';
    del.addEventListener('click', function (e) {
        deleteBlackSite(e);
    });
    document.getElementById('blackList').appendChild(li).appendChild(del);
}

function deleteBlackSite(e) {
    var targetElement = e.path[1];
    blackList.splice(blackList.indexOf(targetElement.innerText), 1);
    document.getElementById('blackList').removeChild(targetElement);
    updateBlackList();
}

function updateBlackList() {
    storage.saveSettings(STORAGE_BLACK_LIST, blackList);
}