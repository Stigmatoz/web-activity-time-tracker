'use strict';

class Activity {
    addTab(tab) {
        if (this.isValidPage(tab) === true) {
            if (tab.id && (tab.id != 0)) {
                tabs = tabs || [];
                var url = new Url(tab.url);
                var isDifferentUrl = false;
                if (!url.isMatch(currentTab)) {
                    isDifferentUrl = true;
                }

                if (this.isNewUrl(url) && !this.isInBlackList(url)) {
                    var favicon = tab.favIconUrl;
                    if (favicon === undefined) {
                        favicon = 'chrome://favicon/' + url.host;
                    }
                    var newTab = new Tab(url, favicon);
                    tabs.push(newTab);
                }

                if (isDifferentUrl && !this.isInBlackList(url)) {
                    this.setCurrentActiveTab(url);
                    var tabUrl = this.getTab(url);
                    if (tabUrl !== undefined)
                        tabUrl.incCounter();
                    this.addTimeInterval(url);
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
            return setting_black_list.find(o => o.isMatch(domain)) !== undefined;
        else return false;
    }

    isLimitExceeded(domain, tab) {
        if (setting_restriction_list !== undefined && setting_restriction_list.length > 0) {
            var item = setting_restriction_list.find(o => o.url.isMatch(domain));
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
            let defItem = deferredRestrictionsList.find(x => new Url(x.site).isMatch(domain));
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
            return tabs.find(o => o.url.isMatch(domain)) === undefined;
        else return true;
    }

    getTab(domain) {
        if (tabs !== undefined)
            return tabs.find(o => o.url.isMatch(domain));
    }

   
    updateFavicon(tab) {
        if (!this.isValidPage(tab)){
            return;
        }
        
        var url = new Url(tab.url);
        var currentTab = this.getTab(url);
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

    addTimeInterval(domain) {
        var item = timeIntervalList.find(o => o.url.isMatch(domain) && o.day == todayLocalDate());
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

    closeIntervalForCurrentTab(preserveCurrentTab) {
        if (currentTab && timeIntervalList != undefined) {
            var item = timeIntervalList.find(o => o.url.isMatch(currentTab) && o.day == todayLocalDate());
            if (item != undefined)
                item.closeInterval();
        }

        if (!preserveCurrentTab) {
            currentTab = null;
        }
    }

    isNeedNotifyView(domain, tab){
        if (setting_notification_list !== undefined && setting_notification_list.length > 0) {
            var item = setting_notification_list.find(o => o.url.isMatch(domain));
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