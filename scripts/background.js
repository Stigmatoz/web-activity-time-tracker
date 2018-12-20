'use strict';

var tabs = [];
var activity = new Activity();
var storage = new LocalStorage();

chrome.tabs.onActivated.addListener(function (info) {
    chrome.tabs.get(info.tabId, function (tab) {
        activity.addTab(tab);
    });
});

chrome.windows.getLastFocused({populate: true}, function (window){
    var s = window;
});