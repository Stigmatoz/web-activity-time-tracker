var storage = new LocalStorage();
var blackList = [];
var restrictionList = [];
var blockBtnList = ['settingsBtn', 'restrictionsBtn', 'aboutBtn'];
var blockList = ['settingsBlock', 'restrictionsBlock', 'aboutBlock'];

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settingsBtn').addEventListener('click', function () {
        setBlockEvent('settingsBtn', 'settingsBlock');
    });
    document.getElementById('restrictionsBtn').addEventListener('click', function () {
        setBlockEvent('restrictionsBtn', 'restrictionsBlock');
    });
    document.getElementById('aboutBtn').addEventListener('click', function () {
        setBlockEvent('aboutBtn', 'aboutBlock');
        loadVersion();
    });
    document.getElementById('clearAllData').addEventListener('click', function () {
        clearAllData();
    });
    document.getElementById('addBlackSiteBtn').addEventListener('click', function () {
        addNewBlackSiteClickHandler();
    });
    document.getElementById('addRestrictionSiteBtn').addEventListener('click', function () {
        addNewRestrictionSiteClickHandler();
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

function setBlockEvent(btnName, blockName) {
    blockBtnList.forEach(element => {
        if (element === btnName) {
            document.getElementById(btnName).classList.add('active');
        }
        else document.getElementById(element).classList.remove('active');
    });

    blockList.forEach(element => {
        if (element === blockName) {
            document.getElementById(blockName).hidden = false;
        } else document.getElementById(element).hidden = true;
    });
}

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
    storage.getSettings(STORAGE_RESTRICTION_LIST, function (items) {
        restrictionList = items;
        viewRestrictionList(items);
    });
}

function loadVersion() {
    var version = chrome.runtime.getManifest().version;
    document.getElementById('version').innerText = 'v' + version;
}

function viewBlackList(items) {
    if (items !== undefined) {
        for (var i = 0; i < items.length; i++) {
            addDomainToListBox(items[i]);
        }
    }
}

function viewRestrictionList(items) {
    if (items !== undefined) {
        for (var i = 0; i < items.length; i++) {
            addDomainToRestrictionListBox(items[i]);
        }
    }
}

function clearAllData() {
    var tabs = [];
    chrome.extension.getBackgroundPage().tabs = tabs;
    storage.saveTabs(tabs, allDataDeletedSuccess);
}

function allDataDeletedSuccess(){
    viewNotify('notify');
}

function viewNotify(elementName) {
    document.getElementById(elementName).hidden = false;
    setTimeout(function () { document.getElementById(elementName).hidden = true; }, 3000);
}

function addNewBlackSiteClickHandler() {
    var newBlackSite = document.getElementById('addBlackSiteLbl').value;
    if (newBlackSite !== '') {
        if (!isContainsBlackSite(newBlackSite)) {
            addDomainToListBox(newBlackSite);
            if (blackList === undefined)
                blackList = [];
            blackList.push(newBlackSite);
            document.getElementById('addBlackSiteLbl').value = '';

            updateBlackList();
        } else viewNotify('notifyForBlackList');
    }
}

function addNewRestrictionSiteClickHandler() {
    var newRestrictionSite = document.getElementById('addRestrictionSiteLbl').value;
    var newRestrictionTime = document.getElementById('addRestrictionTimeLbl').value;
    if (newRestrictionSite !== '' && newRestrictionTime !== '') {
        if (!isContainsRestrictionSite(newRestrictionSite)) {
            addDomainToRestrictionListBox(new Restriction(newRestrictionSite, newRestrictionTime));
            if (restrictionList === undefined)
                restrictionList = [];
            restrictionList.push(new Restriction(newRestrictionSite, newRestrictionTime));
            document.getElementById('addRestrictionSiteLbl').value = '';
            document.getElementById('addRestrictionTimeLbl').value = '';

            updateRestrictionList();
        }
        else viewNotify('notifyForRestrictionList');
    }
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

function addDomainToRestrictionListBox(resctiction) {
    var li = document.createElement('li');

    var domainLbl = document.createElement('input');
    domainLbl.type = 'text';
    domainLbl.classList.add('readonly-input', 'inline-block', 'restriction-item');
    domainLbl.value = resctiction.domain;
    domainLbl.readOnly = true;
    domainLbl.setAttribute('name', 'domain');

    var edit = document.createElement('img');
    edit.setAttribute('name', 'editCmd');
    edit.height = 14;
    edit.src = '/icons/edit.png';
    edit.addEventListener('click', function (e) {
        editRestrictionSite(e);
    });

    var del = document.createElement('img');
    del.height = 12;
    del.src = '/icons/delete.png';
    del.classList.add('margin-left-5');
    del.addEventListener('click', function (e) {
        deleteRestrictionSite(e);
    });

    var timeElement = document.createElement('input');
    var timeArray = resctiction.time.split(':');
    var resultTime = timeArray[0] + 'h ' + timeArray[1] + 'm';
    timeElement.type = 'text';
    timeElement.value = resultTime;
    timeElement.readOnly = true;
    timeElement.classList.add('readonly-input', 'block', 'margin-top-5');
    timeElement.setAttribute('name', 'time');

    var hr = document.createElement('hr');
    var li = document.getElementById('restrictionsList').appendChild(li);
    li.appendChild(domainLbl);
    li.appendChild(del);
    li.appendChild(edit);
    li.appendChild(timeElement);
    li.appendChild(hr);
}

function deleteBlackSite(e) {
    var targetElement = e.path[1];
    blackList.splice(blackList.indexOf(targetElement.innerText), 1);
    document.getElementById('blackList').removeChild(targetElement);
    updateBlackList();
}

function deleteRestrictionSite(e) {
    var targetElement = e.path[1];
    restrictionList.splice(restrictionList.indexOf(targetElement.innerText), 1);
    document.getElementById('restrictionsList').removeChild(targetElement);
    updateRestrictionList();
}

function editRestrictionSite(e) {
    var targetElement = e.path[1];
    var domainElement = targetElement.querySelector('[name="domain"]');
    var timeElement = targetElement.querySelector('[name="time"]');
    if (timeElement.readOnly == true) {
        timeElement.classList.remove('readonly-input');
        timeElement.readOnly = false;
        var timeText = targetElement.querySelector('[name="time"]').value;
        var hour = timeText.split(' ')[0].slice(0, 2);
        var min = timeText.split(' ')[1].slice(0, 2);
        timeElement.type = 'time';
        timeElement.value = hour + ':' + min;
        var editCmd = targetElement.querySelector('[name="editCmd"]');
        editCmd.src = '/icons/success.png';
    }
    else {
        var domain = domainElement.value;
        var time = timeElement.value;
        if (domain !== '' && time !== '') {
            var editCmd = targetElement.querySelector('[name="editCmd"]');
            editCmd.src = '/icons/edit.png';
            timeElement.classList.add('readonly-input');
            timeElement.readOnly = true;
            updateItemFromResctrictoinList(domain, time);

            updateRestrictionList();
        }
    }
}

function isContainsRestrictionSite(domain) {
    return restrictionList.find(x => x.domain == domain) != undefined;
}

function isContainsBlackSite(domain) {
    return blackList.find(x => x == domain) != undefined;
}

function updateItemFromResctrictoinList(domain, time) {
    restrictionList.find(x => x.domain === domain).time = time;
}

function updateBlackList() {
    storage.saveSettings(STORAGE_BLACK_LIST, blackList);
}

function updateRestrictionList() {
    storage.saveSettings(STORAGE_RESTRICTION_LIST, restrictionList);
}