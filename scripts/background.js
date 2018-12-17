window.onload = function () {
    window.timer = new WebTimer();
    chrome.tabs.onActivated.addListener(function (info) {
        chrome.tabs.get(info.tabId, function (tab) {
            window.timer.addTab(tab);
        });
    });
};

var WebTimer = function () { };

WebTimer.prototype = {
    tabs: [],
    activeTab: {},

    addTab: function (tab) {
        if (this.isValidPage(tab) === true) {
            if (tab.id && (tab.id != 0)) {
                this.tabs = this.tabs || [];
                this.tabs.push(tab.url);
                this.activeTab = tab.url;
            }
        }
    },

    isValidPage: function (tab) {
        if (!tab || !tab.url || (tab.url.indexOf('http:') == -1 && tab.url.indexOf('https:') == -1)
            || tab.url.indexOf('chrome://') !== -1
            || tab.url.indexOf('chrome-extension://') !== -1)
            return false;
        return true;
    }
};