'use strict';

class Activity {
    addTab(tab) {
        if (this.isValidPage(tab) === true) {
            if (tab.id && (tab.id != 0)) {
                tabs = tabs || [];
                var domain = extractHostname(tab.url);
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
        } else this.closeIntervalForCurrentTab();
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
            return setting_black_list.find(o => isDomainEquals(extractHostname(o), extractHostname(domain))) !== undefined;
        else return false;
    }

    isLimitExceeded(domain, tab) {
        if (setting_restriction_list !== undefined && setting_restriction_list.length > 0) {
            var item = setting_restriction_list.find(o => isDomainEquals(extractHostname(o.domain), extractHostname(domain)));
            if (item !== undefined) {
                var data = tab.days.find(x => x.date == todayLocalDate());
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

    wasDeferred(domain){
        if (deferredRestrictionsList != undefined){
            let defItem = deferredRestrictionsList.find(x => extractHostname(x.site) == extractHostname(domain));
            if (defItem != null){
                let time = defItem.dateOfDeferred;
                if (time + DEFERRED_TIMEOUT > new Date().getTime()){
                    return true;
                }
                else {
                    let index = deferredRestrictionsList.indexOf(defItem);
                    if (index > -1)
                        deferredRestrictionsList.splice(index, 1);

                    return false;
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

   
    updateFavicon(tab) {
        var domain = extractHostname(tab.url);
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
        this.addTimeInterval(domain);
    }

    clearCurrentActiveTab() {
        this.closeIntervalForCurrentTab();
        currentTab = '';
    }

    addTimeInterval(domain) {
        var item = timeIntervalList.find(o => o.domain === domain && o.day == todayLocalDate());
        if (item != undefined) {
            if (item.day == todayLocalDate())
                item.addInterval();
            else {
                var newInterval = new TimeInterval(todayLocalDate(), domain);
                newInterval.addInterval();
                timeIntervalList.push(newInterval);
            }
        } else {
            var newInterval = new TimeInterval(todayLocalDate(), domain);
            newInterval.addInterval();
            timeIntervalList.push(newInterval);
        }
    }

    closeIntervalForCurrentTab() {
        if (currentTab !== '' && timeIntervalList != undefined) {
            var item = timeIntervalList.find(o => o.domain === currentTab && o.day == todayLocalDate());
            if (item != undefined)
                item.closeInterval();
        }
        currentTab = '';
    }

    isNeedNotifyView(domain, tab){
        if (setting_notification_list !== undefined && setting_notification_list.length > 0) {
            var item = setting_notification_list.find(o => isDomainEquals(extractHostname(o.domain), extractHostname(domain)));
            if (item !== undefined) {
                var today = todayLocalDate();
                var data = tab.days.find(x => x.date == today);
                if (data !== undefined) {
                    var todayTimeUse = data.summary;
                    if (todayTimeUse == item.time || todayTimeUse % item.time == 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
};