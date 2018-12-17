window.onload = function () {
    window.timer = new WebTimer();
    chrome.tabs.onActivated.addListener(function (info) {
        chrome.tabs.get(info.tabId, function (tab) {
            window.timer.addTab(tab);
        });
    });
};