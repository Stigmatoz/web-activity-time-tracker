var WebTimer = function () { };

WebTimer.prototype = {
    tabs: [],
    currentTab: {},

    addTab: function (tab) {
        if (this.isValidPage(tab) === true) {
            if (tab.id && (tab.id != 0)) {
                this.tabs = this.tabs || [];
                var domain = this.extractHostname(tab.url);
                if (this.isNewUrl(domain)) {
                    var newTab = new Tab(domain, tab.favIconUrl);
                    this.tabs.push(newTab);
                }
                this.startTimeTracker(tab);
                this.currentTab = domain;
            }
        }
    },

    isNewUrl: function (domain) {
        if (this.tabs.length > 0)
            return this.tabs.find(o => o.url === domain) === undefined;
        else return true;
    },

    extractHostname: function (url) {
        var hostname;

        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];

        return hostname;
    },

    isValidPage: function (tab) {
        if (!tab || !tab.url || (tab.url.indexOf('http:') == -1 && tab.url.indexOf('https:') == -1)
            || tab.url.indexOf('chrome://') !== -1
            || tab.url.indexOf('chrome-extension://') !== -1)
            return false;
        return true;
    },

    startTimeTracker: function (tab) {
        var tab = new Tab(tab.url, tab.favIconUrl);
    }
};