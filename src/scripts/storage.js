'use strict';

class LocalStorage {
    loadTabs(name, callback, callbackIsUndefined) {
        chrome.storage.local.get(name, function(item) {
            if (item[name] !== undefined) {
                var result = item[name];
                if (result !== undefined)
                    callback(result);
            } else {
                if (callbackIsUndefined !== undefined)
                    callbackIsUndefined();
            }
        });
    }

    saveTabs(value, callback) {
        chrome.storage.local.set({ tabs: value });
        if (callback !== undefined)
            callback();
    }

    saveValue(name, value) {
        chrome.storage.local.set({
            [name]: value
        });
    }

    getValue(name, callback) {
        chrome.storage.local.get(name, function(item) {
            if (item !== undefined) {
                callback(item[name]);
            }
        });
    }

    getMemoryUse(name, callback) {
        chrome.storage.local.getBytesInUse(name, callback);
    };
}