'use strict';

var tabs;
var timeIntervalList;
var currentTab;
var isNeedDeleteTimeIntervalFromTabs = false;
var activity = new Activity();
var storage = new LocalStorage();
var deferredRestrictionsList;

var setting_white_list;
var setting_restriction_list;
var setting_interval_save;
var setting_interval_inactivity;
var setting_view_in_badge;
var setting_block_deferral;
var setting_dark_mode;
var setting_notification_list;
var setting_notification_message;

var isHasPermissioForYouTube;
var isHasPermissioForNetflix;
var isHasPermissioForNotification;

let lastActiveTabUrl = '';
let tabToUrl = {};

function updateSummaryTime() {
    setInterval(backgroundCheck, SETTINGS_INTERVAL_CHECK_DEFAULT);
}

function updateStorage() {
    setInterval(backgroundUpdateStorage, SETTINGS_INTERVAL_SAVE_STORAGE_DEFAULT);
}

function backgroundCheck() {
    chrome.windows.getLastFocused({ populate: true }, function(currentWindow) {
        if (currentWindow && currentWindow.focused) {
            var activeTab = currentWindow.tabs.find(t => t.active === true);
            if (activeTab !== undefined && activity.isValidPage(activeTab)) {
                var activeUrl = new Url(activeTab.url);
                var tab = activity.getTab(activeUrl);
                if (tab === undefined) {
                    activity.addTab(activeTab);
                }

                if (activity.isInBlackList(activeUrl)) {
                    chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' })
                    chrome.browserAction.setBadgeText({
                        tabId: activeTab.id,
                        text: 'n/a'
                    });
                } else {
                    if (tab !== undefined) {
                        if (!tab.url.isMatch(currentTab)) {
                            activity.setCurrentActiveTab(tab.url);
                        }
                        chrome.idle.queryState(parseInt(setting_interval_inactivity), function(state) {
                            if (state === 'active') {
                                mainTRacker(activeUrl, tab, activeTab);
                            } else checkDOM(state, activeUrl, tab, activeTab);
                        });
                    }
                }
            }
        } else activity.closeIntervalForCurrentTab(true);
    });
}

function mainTRacker(activeUrl, tab, activeTab) {
    if (activity.isLimitExceeded(activeUrl, tab) && !activity.wasDeferred(activeUrl)) {
        setBlockPageToCurrent(activeTab.url);
    }
    if (!activity.isInBlackList(activeUrl)) {
        if (activity.isNeedNotifyView(activeUrl, tab)) {
            if (isHasPermissioForNotification) {
                showNotification(activeUrl, tab);
            } else {
                checkPermissionsForNotifications(showNotification, activeUrl, tab);
            }
        }
        tab.incSummaryTime();
    }
    if (setting_view_in_badge === true) {
        chrome.browserAction.setBadgeBackgroundColor({ color: '#1aa1434d' })
        var summary = tab.days.find(s => s.date === todayLocalDate()).summary;
        chrome.browserAction.setBadgeText({
            tabId: activeTab.id,
            text: String(convertSummaryTimeToBadgeString(summary))
        });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] })
        chrome.browserAction.setBadgeText({
            tabId: activeTab.id,
            text: ''
        });
    }
}

function showNotification(activeUrl, tab) {
    chrome.notifications.clear('watt-site-notification', function(wasCleared) {
        if (!wasCleared) {
            console.log('!wasCleared');

            chrome.notifications.create(
                'watt-site-notification', {
                    type: 'basic',
                    iconUrl: 'icons/128x128.png',
                    title: "Web Activity Time Tracker",
                    contextMessage: activeUrl + ' ' + convertShortSummaryTimeToString(tab.getTodayTime()),
                    message: setting_notification_message
                },
                function(notificationId) {
                    console.log(notificationId);
                    chrome.notifications.clear('watt-site-notification', function(wasCleared) {
                        if (wasCleared)
                            notificationAction(activeUrl, tab);
                    });
                });
        } else {
            notificationAction(activeUrl, tab);
        }
    });
}

function notificationAction(activeUrl, tab) {
    chrome.notifications.create(
        'watt-site-notification', {
            type: 'basic',
            iconUrl: 'icons/128x128.png',
            title: "Web Activity Time Tracker",
            contextMessage: activeUrl + ' ' + convertShortSummaryTimeToString(tab.getTodayTime()),
            message: setting_notification_message
        });
}

function setBlockPageToCurrent(currentUrl) {
    var blockUrl = chrome.runtime.getURL("block.html") + '?url=' + currentUrl;
    chrome.tabs.query({ currentWindow: true, active: true }, function(tab) {
        chrome.tabs.update(tab.id, { url: blockUrl });
    });
}

function isVideoPlayedOnPage() {
    var videoElement = document.getElementsByTagName('video')[0];
    if (videoElement !== undefined && videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2) {
        return true;
    } else return false;
}

function checkDOM(state, activeUrl, tab, activeTab) {
    if (state === 'idle' && activeUrl.isMatch("youtube.com")) {
        trackForYT(mainTRacker, activeUrl, tab, activeTab);
    } else if (state === 'idle' && activeUrl.isMatch("netflix.com")) {
        trackForNetflix(mainTRacker, activeUrl, tab, activeTab);
    } else activity.closeIntervalForCurrentTab();
}

function trackForYT(callback, activeUrl, tab, activeTab) {
    if (isHasPermissioForYouTube) {
        executeScriptYoutube(callback, activeUrl, tab, activeTab);
    } else {
        checkPermissionsForYT(executeScriptYoutube, activity.closeIntervalForCurrentTab, callback, activeUrl, tab, activeTab);
    }
}

function trackForNetflix(callback, activeUrl, tab, activeTab) {
    if (isHasPermissioForNetflix) {
        executeScriptNetflix(callback, activeUrl, tab, activeTab);
    } else {
        checkPermissionsForNetflix(executeScriptNetflix, activity.closeIntervalForCurrentTab, callback, activeUrl, tab, activeTab);
    }
}

function executeScriptYoutube(callback, activeUrl, tab, activeTab) {
    chrome.tabs.executeScript({ code: "var videoElement = document.getElementsByTagName('video')[0]; (videoElement !== undefined && videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2);" }, (results) => {
        if (results !== undefined && results[0] !== undefined && results[0] === true)
            callback(activeUrl, tab, activeTab);
        else activity.closeIntervalForCurrentTab();
    });
}

function executeScriptNetflix(callback, activeUrl, tab, activeTab) {
    chrome.tabs.executeScript({ code: "var videoElement = document.getElementsByTagName('video')[0]; (videoElement !== undefined && videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2);" }, (results) => {
        if (results !== undefined && results[0] !== undefined && results[0] === true) {
            callback(activeUrl, tab, activeTab);
        } else {
            activity.closeIntervalForCurrentTab();
        }
    });
}

async function sendIntervalEvent(intervalList) {
    storage.getValue(STORAGE_USER_EMAIL, async function(email) {
        const userEmail = email
        const requestPayload = {
            user: userEmail,
            intervals: intervalList,
        }
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };
        try {
            // change this to the real URL
            const requestURL = 'https://jsonplaceholder.typicode.com/posts';
            const fetchResponse = await fetch(requestURL, settings);
            const data = await fetchResponse.json();
            console.warn('got back', data)
        } catch (e) {
            return e;
        }
    });
}

function backgroundUpdateStorage() {
    if (tabs != undefined && tabs.length > 0)
        storage.saveTabs(tabs);
    if (timeIntervalList != undefined && timeIntervalList.length > 0)
        storage.saveValue(STORAGE_TIMEINTERVAL_LIST, timeIntervalList);
    sendIntervalEvent(timeIntervalList);
}

const showGeolocationError = (error) => {
    storage.saveValue(USER_LOCATION_LAT, null);
    storage.saveValue(USER_LOCATION_LONG, null);
    console.error( 'Geolocation - getCurrentPosition error:', error);
}

const saveCurrentPosition = (position) => {
    storage.saveValue(USER_LOCATION_LAT, position.coords.latitude);
    storage.saveValue(USER_LOCATION_LONG, position.coords.longitude);
}

function setDefaultSettings() {
    storage.saveValue(SETTINGS_INTERVAL_INACTIVITY, SETTINGS_INTERVAL_INACTIVITY_DEFAULT);
    storage.saveValue(SETTINGS_INTERVAL_RANGE, SETTINGS_INTERVAL_RANGE_DEFAULT);
    storage.saveValue(SETTINGS_VIEW_TIME_IN_BADGE, SETTINGS_VIEW_TIME_IN_BADGE_DEFAULT);
    storage.saveValue(SETTINGS_BLOCK_DEFERRAL, SETTINGS_BLOCK_DEFERRAL_DEFAULT);
    storage.saveValue(SETTINGS_DARK_MODE, SETTINGS_DARK_MODE_DEFAULT);
    storage.saveValue(SETTINGS_INTERVAL_SAVE_STORAGE, SETTINGS_INTERVAL_SAVE_STORAGE_DEFAULT);
    storage.saveValue(STORAGE_NOTIFICATION_MESSAGE, STORAGE_NOTIFICATION_MESSAGE_DEFAULT);
    chrome.identity.getProfileUserInfo(function(info) {
        if (info && info.email) {
            storage.saveValue(STORAGE_USER_EMAIL, info.email)
        } else {
            storage.saveValue(STORAGE_USER_EMAIL, 'unknown');
        }
    });
    navigator.geolocation.getCurrentPosition(saveCurrentPosition, showGeolocationError);
}

function checkSettingsImEmpty() {
    chrome.storage.local.getBytesInUse(['inactivity_interval'], function(item) {
        if (item == 0) {
            setDefaultSettings();
        }
    });
}

function setDefaultValueForNewSettings() {
    loadNotificationMessage();
}

const getStartTime = (param) => {
    const {year, month, day, hourStart, minStart, secStart} = param;
    return Date.UTC(year, month - 1, day, hourStart, minStart, secStart);
}

const getMilliseconds = (hour, min, sec) => {
    return hour * HOURS_MS + min * MIN_MS + sec * SEC_MS;
}

const getDuration = (param) => {
    const {hourEnd, minEnd, secEnd, hourStart, minStart, secStart} = param;
    const countSecEnd = getMilliseconds(hourEnd, minEnd, secEnd);
    const countSecStart = getMilliseconds(hourStart, minStart, secStart);
    return countSecEnd - countSecStart;
}

const extractTime = (start, end) => {
    const startArr = start.split(':');
    const endArr = end.split(':');
    const [hourStart, minStart, secStart] = startArr;
    const [hourEnd, minEnd, secEnd] = endArr;

    return {
        hourStart: +hourStart,
        minStart: +minStart,
        secStart: +secStart,
        hourEnd: +hourEnd,
        minEnd: +minEnd,
        secEnd: +secEnd
    }
}

const mapTime = (length, item) => {
    let duration = 0;
    let startTime = null;
    let start, end;
    const [month, day, year] = item.day.split('/');

    if (length === 1) {
        const arr = item.intervals[0].split('-');
        start = arr[0];
        end = arr[1];
    }
    if (length > 1) {
        start = item.intervals[0].split('-')[0];
        end = item.intervals[length - 1].split('-')[1];
    }
    const { hourStart, minStart, secStart, hourEnd, minEnd, secEnd } = extractTime(start, end);
    startTime = getStartTime({
        year: +year,
        month: +month,
        day: +day,
        hourStart,
        minStart,
        secStart
    });
    duration = getDuration({
        hourEnd,
        minEnd,
        secEnd,
        hourStart,
        minStart,
        secStart
    });
    return {duration, startTime};
}

const postUserActivity = async (requestBody) => {
    try {
        await fetch(TRACK_USER_ACTIVITY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
    } catch(error) {
        console.error(error);
    }
}

const getDataFromStorage = (itemName, defaultValue) => {
    return new Promise((resolve, reject) => {
        storage.getValue(itemName, result => {
            resolve(result || defaultValue);
        });
    });
}

const trackUserActivity = async () => {
    const userEmail = await getDataFromStorage(STORAGE_USER_EMAIL, '');
    const latitude = await getDataFromStorage(USER_LOCATION_LAT, null);
    const longitude = await getDataFromStorage(USER_LOCATION_LONG, null);
    let listItems = timeIntervalList || [];
    listItems = listItems.filter(item => item.day === todayLocalDate());
    const activityArray = listItems.map(item => {
        const intervalLength = item.intervals.length;
        const {duration, startTime} = mapTime(intervalLength, item);
        return {
            url: item.url,
            duration,
            startTime
        };
    });
    const filteredActivity = activityArray.filter(item => item.duration);
    if (filteredActivity.length) {
        const requestBody =  {
            user: userEmail,
            location: {
                latitude,
                longitude
            },
            activity: filteredActivity
        };
        postUserActivity(requestBody);
    }
}

const getWhiteListFromStorage = () => {
    return new Promise((resolve, reject) => {
        storage.getValue(STORAGE_WHITE_LIST, whiteList => {
            resolve(whiteList || []);
        });
    });
}

const trackUserActivityHelper = async (lastActiveTabUrl) => {
    const whiteList = await getWhiteListFromStorage();
    const tabFromWhiteList = whiteList.find(item => lastActiveTabUrl.includes(item.split('://')[1]));
    if (tabFromWhiteList) trackUserActivity();
}

function addListener() {
    chrome.tabs.onActivated.addListener(activeInfo => {
        chrome.tabs.get(activeInfo.tabId, async (tab) => {
            activity.addTab(tab);
            await trackUserActivityHelper(lastActiveTabUrl);
            lastActiveTabUrl = tab.url;
            tabToUrl[activeInfo.tabId] = tab.url;
        });
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            if (lastActiveTabUrl !== tab.url) {
                await trackUserActivityHelper(lastActiveTabUrl);
            }
            lastActiveTabUrl = tab.url;
            tabToUrl[tabId] = tab.url;
        }
    });

    chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
        if (removeInfo.isWindowClosing) {
            return;
        }
        if ( tabToUrl[tabId] !== lastActiveTabUrl) {
            await trackUserActivityHelper(tabToUrl[tabId]);
        }
        delete tabToUrl[tabId];
    });

    chrome.windows.onRemoved.addListener(windowId => {
        trackUserActivity();
    });

    chrome.webNavigation.onCompleted.addListener(function(details) {
        chrome.tabs.get(details.tabId, function(tab) {
            activity.updateFavicon(tab);
        });
    });

    chrome.runtime.onInstalled.addListener(function(details) {
        if (details.reason == 'install') {
            storage.saveValue(SETTINGS_SHOW_HINT, SETTINGS_SHOW_HINT_DEFAULT);
            setDefaultSettings();
        }
        if (details.reason == 'update') {
            storage.saveValue(SETTINGS_SHOW_HINT, SETTINGS_SHOW_HINT_DEFAULT);
            checkSettingsImEmpty();
            setDefaultValueForNewSettings();
            isNeedDeleteTimeIntervalFromTabs = true;
        }
    });

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            if (key === STORAGE_WHITE_LIST) {
                loadWhiteList();
            }
            if (key === STORAGE_RESTRICTION_LIST) {
                loadRestrictionList();
            }
            if (key === STORAGE_NOTIFICATION_LIST) {
                loadNotificationList();
            }
            if (key === STORAGE_NOTIFICATION_MESSAGE) {
                loadNotificationMessage();
            }
            if (key === SETTINGS_INTERVAL_INACTIVITY) {
                storage.getValue(SETTINGS_INTERVAL_INACTIVITY, function(item) { setting_interval_inactivity = item; });
            }
            if (key === SETTINGS_VIEW_TIME_IN_BADGE) {
                storage.getValue(SETTINGS_VIEW_TIME_IN_BADGE, function(item) { setting_view_in_badge = item; });
            }
            if (key === SETTINGS_BLOCK_DEFERRAL) {
                storage.getValue(SETTINGS_BLOCK_DEFERRAL, function(item) { setting_block_deferral = item; });
            }
            if (key === SETTINGS_DARK_MODE) {
                storage.getValue(SETTINGS_DARK_MODE, function(item) { setting_dark_mode = item; });
            }
        }
    });

    chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSdImHtvey6sg5mzsQwWfAQscgZOOV52blSf9HkywSXJhuQQHg/viewform");
}

function loadTabs() {
    storage.loadTabs(STORAGE_TABS, function(items) {
        tabs = [];
        items = items || [];

        for (var i = 0; i < items.length; i++) {
            tabs.push(new Tab(items[i].url, items[i].favicon, items[i].days, items[i].summaryTime, items[i].counter));
        }
        if (isNeedDeleteTimeIntervalFromTabs)
            deleteTimeIntervalFromTabs();
    });
}

function deleteTimeIntervalFromTabs() {
    tabs.forEach(function(item) {
        item.days.forEach(function(day) {
            if (day.time != undefined)
                day.time = [];
        })
    })
}

function deleteYesterdayTimeInterval() {
    timeIntervalList = timeIntervalList.filter(x => x.day == todayLocalDate());
}

function loadWhiteList() {
    storage.getValue(STORAGE_WHITE_LIST, function(items) {
        setting_white_list = [];
        items = items || [];

        for (var i = 0; i < items.length; i++) {
            setting_white_list.push(new Url(items[i]));
        }
    })
}

function loadTimeIntervals() {
    storage.getValue(STORAGE_TIMEINTERVAL_LIST, function(items) {
        timeIntervalList = [];
        items = items || [];

        for (var i = 0; i < items.length; i++) {
            // get user
            timeIntervalList.push(new TimeInterval(items[i].day, items[i].url || items[i].domain, items[i].intervals));
        }
        deleteYesterdayTimeInterval();
    });
}

function loadRestrictionList() {
    storage.getValue(STORAGE_RESTRICTION_LIST, function(items) {
        setting_restriction_list = [];
        items = items || [];

        for (var i = 0; i < items.length; i++) {
            setting_restriction_list.push(new Restriction(items[i].url || items[i].domain, items[i].time));
        }
    });
}

function loadNotificationList() {
    storage.getValue(STORAGE_NOTIFICATION_LIST, function(items) {
        setting_notification_list = [];
        items = items || [];

        for (var i = 0; i < items.length; i++) {
            setting_notification_list.push(new Notification(items[i].url || items[i].domain, items[i].time));
        }
    });
}

function loadNotificationMessage() {
    storage.getValue(STORAGE_NOTIFICATION_MESSAGE, function(item) {
        setting_notification_message = item;
        if (isEmpty(setting_notification_message)) {
            storage.saveValue(STORAGE_NOTIFICATION_MESSAGE, STORAGE_NOTIFICATION_MESSAGE_DEFAULT);
            setting_notification_message = STORAGE_NOTIFICATION_MESSAGE_DEFAULT;
        }
    });
}

function loadSettings() {
    storage.getValue(SETTINGS_INTERVAL_INACTIVITY, function(item) { setting_interval_inactivity = item; });
    storage.getValue(SETTINGS_VIEW_TIME_IN_BADGE, function(item) { setting_view_in_badge = item; });
    storage.getValue(SETTINGS_BLOCK_DEFERRAL, function(item) { setting_block_deferral = item; });
    storage.getValue(SETTINGS_DARK_MODE, function(item) { setting_dark_mode = item; });
}

function loadAddDataFromStorage() {
    loadTabs();
    loadTimeIntervals();
    loadWhiteList();
    loadRestrictionList();
    loadNotificationList();
    loadNotificationMessage();
    loadSettings();
}

function loadPermissions() {
    checkPermissionsForYT();
    checkPermissionsForNetflix();
    checkPermissionsForNotifications();
}

function checkPermissionsForYT(callbackIfTrue, callbackIfFalse, ...props) {
    chrome.permissions.contains({
        permissions: ['tabs'],
        origins: ["https://www.youtube.com/*"]
    }, function(result) {
        if (callbackIfTrue != undefined && result)
            callbackIfTrue(...props);
        if (callbackIfFalse != undefined && !result)
            callbackIfFalse();
        isHasPermissioForYouTube = result;
    });
}

function checkPermissionsForNetflix(callbackIfTrue, callbackIfFalse, ...props) {
    chrome.permissions.contains({
        permissions: ['tabs'],
        origins: ["https://www.netflix.com/*"]
    }, function(result) {
        if (callbackIfTrue != undefined && result)
            callbackIfTrue(...props);
        if (callbackIfFalse != undefined && !result)
            callbackIfFalse();
        isHasPermissioForNetflix = result;
    });
}

function checkPermissionsForNotifications(callback, ...props) {
    chrome.permissions.contains({
        permissions: ["notifications"]
    }, function(result) {
        if (callback != undefined && result)
            callback(...props);
        isHasPermissioForNotification = result;
    });
}

loadPermissions();
addListener();
loadAddDataFromStorage();
updateSummaryTime();
updateStorage();
