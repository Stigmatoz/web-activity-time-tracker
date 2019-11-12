'use strict';

class Activity {
    addTab(tab) {
        if (this.isValidPage(tab) === true) {
            if (tab.id && (tab.id != 0)) {
                tabs = tabs || [];
                var domain = this.extractHostname(tab.url);
                var isDifferentUrl = false;
                if (currentTab !== tab.url) {
                    isDifferentUrl = true;
                }

                if (this.isNewUrl(domain) && !this.isInBlackList(domain)) {
                    var favicon = tab.favIconUrl;
                    if (favicon === undefined) {
                        favicon = 'chrome://favicon/' + domain;
                    }
                    var newTab = new Tab(domain, favicon);
                    tabs.push(newTab);
                }

                if (isDifferentUrl && !this.isInBlackList(domain)) {
                    this.setCurrentActiveTab(domain);
                    var tabUrl = this.getTab(domain);
                    if (tabUrl !== undefined)
                        tabUrl.incCounter();
                    this.addTimeInterval(domain);
                }
            }
        }
    }

    isValidPage(tab) {
        if (!tab || !tab.url || (tab.url.indexOf('http:') == -1 && tab.url.indexOf('https:') == -1)
            || tab.url.indexOf('chrome://') !== -1
            || tab.url.indexOf('chrome-extension://') !== -1)
            return false;
        return true;
    }

    isInBlackList(domain) {
        if (setting_black_list !== undefined && setting_black_list.length > 0)
            return setting_black_list.find(o => isDomainEquals(this.extractHostname(o), this.extractHostname(domain))) !== undefined;
        else return false;
    }

    isLimitExceeded(domain, tab) {
        if (setting_restriction_list !== undefined && setting_restriction_list.length > 0) {
            var item = setting_restriction_list.find(o => isDomainEquals(this.extractHostname(o.domain), this.extractHostname(domain)));
            if (item !== undefined) {
                var today = new Date().toLocaleDateString("en-US");
                var data = tab.days.find(x => x.date == today);
                if (data !== undefined) {
                    var todayTimeUse = data.summary;
                    if (todayTimeUse >= item.time) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isNewUrl(domain) {
        if (tabs.length > 0)
            return tabs.find(o => o.url === domain) === undefined;
        else return true;
    }

    getTab(domain) {
        if (tabs !== undefined)
            return tabs.find(o => o.url === domain);
    }

    extractHostname(url) {
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
    }

    updateFavicon(tab) {
        var domain = this.extractHostname(tab.url);
        var currentTab = this.getTab(domain);
        if (currentTab !== null && currentTab !== undefined) {
            if (tab.favIconUrl !== undefined && tab.favIconUrl !== currentTab.favicon) {
                currentTab.favicon = tab.favIconUrl;
            }
        }
    }

    setCurrentActiveTab(domain) {
        this.closeIntervalForCurrentTab();
        currentTab = domain;
    }

    clearCurrentActiveTab() {
        this.closeIntervalForCurrentTab();
        currentTab = '';
    }

    addTimeInterval(domain) {
        var item = timeIntervalList.find(o => o.domain === domain);
        if (item != undefined) {
            item.addInterval();
        } else {
            var newInterval = new TimeInterval(new Date().toLocaleDateString("en-US"), domain);
            timeIntervalList.push(newInterval);
            newInterval.addInterval();
        }
    }


    closeIntervalForCurrentTab() {
        if (currentTab !== '') {
            var item = timeIntervalList.find(o => o.domain === currentTab);
            if (item != undefined)
                item.closeInterval();
        }
        currentTab = '';
    }
};