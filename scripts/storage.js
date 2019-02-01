'use strict';

var storageLocal = {
    loadTabs(name, callback) {
        chrome.storage.sync.get(name, function (item) {
            if (item[name] !== undefined) {
                var result = item[name];
                if (result !== undefined)
                    callback(result);
            }
        });
    },

    saveTabs(value, callback) {
        chrome.storage.sync.set({ tabs: value });
        if (callback !== undefined)
            callback();
    },

    saveSettings(name, value) {
        chrome.storage.sync.set({ [name]: value });
    },

    getSettings(name, callback) {
        chrome.storage.sync.get(name, function (item) {
            if (item !== undefined) {
                callback(item[name]);
            }
        });
    }
}