'use strict';

var tabs;
var currentTab;
var activity = new Activity();
var storage = new LocalStorage();

var setting_black_list;
var setting_restriction_list;
var setting_interval_save;
var setting_interval_inactivity;
var setting_view_in_badge;

function updateSummaryTime() {
    setInterval(backgroundCheck, SETTINGS_INTERVAL_CHECK_DEFAULT);
}

function updateStorage() {
    setInterval(backgroundUpdateStorage, SETTINGS_INTERVAL_SAVE_STORAGE_DEFAULT);
}

function backgroundCheck() {
    loadBlackList();
    loadRestrictionList();
    storage.getSettings(SETTINGS_INTERVAL_INACTIVITY, function (item) { setting_interval_inactivity = item; });
    storage.getSettings(SETTINGS_VIEW_TIME_IN_BADGE, function (item) { setting_view_in_badge = item; });
    chrome.windows.getLastFocused({ populate: true }, function (currentWindow) {
        if (currentWindow.focused) {
            var activeTab = currentWindow.tabs.find(t => t.active === true);
            if (activeTab !== undefined && activity.isValidPage(activeTab)) {
                var activeUrl = activity.extractHostname(activeTab.url);
                var tab = activity.getTab(activeUrl);
                if (tab === undefined) {
                    activity.addTab(activeTab);
                }

                if (tab !== undefined) {
                    activity.setCurrentActiveTab(tab.url);
                    chrome.idle.queryState(parseInt(setting_interval_inactivity), function (state) {
                        if (state === 'active' || (state === 'idle' && checkDOM())) {
                            if (activity.isLimitExceeded(activeUrl, tab)) {
                                setBlockPageToCurrent(activeUrl);
                            }
                            if (!activity.isInBlackList(activeUrl))
                                tab.incSummaryTime();
                            if (setting_view_in_badge === true) {
                                if (activity.isInBlackList(activeUrl)) {
                                    chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' })
                                    chrome.browserAction.setBadgeText({
                                        tabId: activeTab.id,
                                        text: 'n/a'
                                    });
                                } else {
                                    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] })
                                    var today = new Date().toLocaleDateString();
                                    var summary = tab.days.find(s => s.date === today).summary;
                                    chrome.browserAction.setBadgeText({
                                        tabId: activeTab.id,
                                        text: String(convertSummaryTimeToBadgeString(summary))
                                    });
                                }
                            } else {
                                chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] })
                                chrome.browserAction.setBadgeText({
                                    tabId: activeTab.id,
                                    text: ''
                                });
                            }
                        }
                    });
                } else {
                    if (activity.isInBlackList(activeUrl)) {
                        chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' })
                        chrome.browserAction.setBadgeText({
                            tabId: activeTab.id,
                            text: 'n/a'
                        });
                    }
                }
            }
        }
    });
}

function setBlockPageToCurrent(activeUrl) {
    var blockUrl = chrome.runtime.getURL("block.html") + '?url=' + activeUrl;
    chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.update(tab.id, { url: blockUrl });
    });
}

function isVideoPlayedOnPage() {
    var videoElement = document.getElementsByTagName('video')[0];
    if (videoElement !== undefined && videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2)
        return true;
}

function checkDOM(){
    chrome.tabs.executeScript({
        code: '(' + isVideoPlayedOnPage + ')();'
    }, (results) => {
        if (results !== undefined && results !== null && results[0] !== undefined)
            return results[0];
    });
}

function backgroundUpdateStorage() {
    if (tabs != undefined && tabs.length > 0)
        storage.saveTabs(tabs);
}

function setDefaultSettings() {
    storage.saveSettings(SETTINGS_INTERVAL_INACTIVITY, SETTINGS_INTERVAL_INACTIVITY_DEFAULT);
    storage.saveSettings(SETTINGS_INTERVAL_RANGE, SETTINGS_INTERVAL_RANGE_DEFAULT);
    storage.saveSettings(SETTINGS_VIEW_TIME_IN_BADGE, SETTINGS_VIEW_TIME_IN_BADGE_DEFAULT);
    storage.saveSettings(SETTINGS_INTERVAL_SAVE_STORAGE, SETTINGS_INTERVAL_SAVE_STORAGE_DEFAULT);
}

function checkSettingsImEmpty() {
    chrome.storage.local.getBytesInUse(['inactivity_interval'], function (item) {
        if (item == 0) {
            setDefaultSettings();
        }
    });
}

function addListener() {
    chrome.tabs.onActivated.addListener(function (info) {
        chrome.tabs.get(info.tabId, function (tab) {
            activity.addTab(tab);
        });
    });

    chrome.webNavigation.onCompleted.addListener(function (details) {
        chrome.tabs.get(details.tabId, function (tab) {
            activity.updateFavicon(tab);
        });
    });
    chrome.runtime.onInstalled.addListener(function (details) {
        if (details.reason == 'install') {
            setDefaultSettings();
        }
        if (details.reason == 'update') {
            checkSettingsImEmpty();
        }
    });
}

function loadTabs() {
    storage.loadTabs(STORAGE_TABS, function (items) {
        tabs = [];
        for (var i = 0; i < items.length; i++) {
            tabs.push(new Tab(items[i].url, items[i].favicon, items[i].days, items[i].summaryTime));
        }
    });
}

function loadBlackList() {
    storage.getSettings(STORAGE_BLACK_LIST, function (items) {
        setting_black_list = items;
    })
}

function loadRestrictionList() {
    storage.getSettings(STORAGE_RESTRICTION_LIST, function (items) {
        setting_restriction_list = items;
    })
}

loadTabs();
loadBlackList();
addListener();
updateSummaryTime();
updateStorage();