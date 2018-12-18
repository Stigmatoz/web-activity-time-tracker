var timer = new WebTimer();

window.onload = function () {
    chrome.tabs.onActivated.addListener(function (info) {
        chrome.tabs.get(info.tabId, function (tab) {
            timer.addTab(tab);
        });
    });
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        timer.addTab(tab);
    });
};