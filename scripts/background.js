'use strict';

var tabs = [];
var activity = new Activity();
var storage = new LocalStorage();

chrome.tabs.onActivated.addListener(function (info) {
    chrome.tabs.get(info.tabId, function (tab) {
        activity.addTab(tab);
    });
});

setInterval(backgroundCheck, SETTINGS_INTERVAL_CHECK);

function backgroundCheck() {
    chrome.windows.getLastFocused({ populate: true }, function (currentWindow) {
        if (tabs.length > 0) {
            var activeTab = currentWindow.tabs.find(o => o.active === true);
            if (activeTab !== undefined) {
                var activeUrl = activity.extractHostname(activeTab.url);
                var tab = activity.getTab(activeUrl);
                if (tab !== undefined) {
                    chrome.idle.queryState(SETTINGS_INTERVAL_INACTIVITY, function (state) {
                        if (state === 'active') {
                            tab.summaryTime += 1;
                        }
                    });
                }
            }
        }
    });
}