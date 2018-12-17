var WebTimer = function () { };

WebTimer.prototype = {
    tabs: [],
    currentTab: {},

    addTab: function (tab) {
        if (this.isValidPage(tab) === true) {
            if (tab.id && (tab.id != 0)) { 
                this.tabs = this.tabs || [];
                var domain = this.extractRootDomain(tab.url);
                if (!this.tabs.includes(domain)){
                    this.tabs.push(domain);
                }
                this.startTimeTracker(tab);
                this.currentTab = domain;
            }
        }
    },

    extractRootDomain: function (url) {
        var domain = this.extractHostname(url),
            splitArr = domain.split('.'),
            arrLen = splitArr.length;
    
        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
            if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
                domain = splitArr[arrLen - 3] + '.' + domain;
            }
        }
        return domain;
    },

    extractHostname: function(url) {
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

    startTimeTracker: function(tab){
        var tab = new Tab(tab.url, tab.favIconUrl);
    }
};