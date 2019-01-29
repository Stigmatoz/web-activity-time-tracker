'use strict';

var tabs = [];
var currentTab;
var activity = new Activity();
var storage = new LocalStorage();

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
                        if (state === 'active') {
                            tab.incSummaryTime();
                            if (setting_view_in_badge === true) {
                                chrome.browserAction.setBadgeText({
                                    tabId: activeTab.id,
                                    text: String(convertSummaryTimeToBadgeString(tab.summaryTime))
                                });
                            } else {
                                chrome.browserAction.setBadgeText({
                                    tabId: activeTab.id,
                                    text: ''
                                });
                            }
                        }
                    });
                }
            }
        }
    });
}

function backgroundUpdateStorage() {
    if (tabs.length > 0)
        storage.saveTabs(tabs);
}

function setDefaultSettings() {
    storage.saveSettings(SETTINGS_INTERVAL_INACTIVITY, SETTINGS_INTERVAL_INACTIVITY_DEFAULT);
    storage.saveSettings(SETTINGS_INTERVAL_RANGE, SETTINGS_INTERVAL_RANGE_DEFAULT);
    storage.saveSettings(SETTINGS_VIEW_TIME_IN_BADGE, SETTINGS_VIEW_TIME_IN_BADGE_DEFAULT);
    storage.saveSettings(SETTINGS_INTERVAL_SAVE_STORAGE, SETTINGS_INTERVAL_SAVE_STORAGE_DEFAULT);
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
        //if (details.reason == "install") {
        setDefaultSettings();
        //}
    });
}

addListener();
updateSummaryTime();
updateStorage();