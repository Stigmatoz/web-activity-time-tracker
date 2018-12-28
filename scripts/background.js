'use strict';

var tabs = [];
var currentTab;
var activity = new Activity();
var storage = new LocalStorage();

function updateSummaryTime() {
    setInterval(backgroundCheck, SETTINGS_INTERVAL_CHECK);
}

function updateStorage() {
    setInterval(backgroundUpdateStorage, SETTINGS_INTERVAL_SAVE_STORAGE);
}

function backgroundCheck() {
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
                    chrome.idle.queryState(SETTINGS_INTERVAL_INACTIVITY, function (state) {
                        if (state === 'active') {
                            tab.summaryTime += 1;
                            chrome.browserAction.setBadgeText({
                                tabId: activeTab.id,
                                text: String(convertSummaryTimeToBadgeString(tab.summaryTime))
                            });
                        }
                    });
                }
            }
        }
    });
}

function backgroundUpdateStorage() {
    if (tabs.length > 0)
        storage.save(tabs);
}

function addListener() {
    chrome.tabs.onActivated.addListener(function (info) {
        chrome.tabs.get(info.tabId, function (tab) {
            activity.addTab(tab);
        });
    });

    chrome.webNavigation.onCompleted.addListener(function(details){
        chrome.tabs.get(details.tabId, function (tab) {
            activity.updateFavicon(tab);
        });
    });
}

addListener();
updateSummaryTime();
updateStorage();