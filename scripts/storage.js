'use strict';

class LocalStorage {
    loadTabs(name, callback) {
        chrome.storage.local.get(name, function (item) {
            if (item[name] !== undefined) {
                var result = JSON.parse(item[name]);
                if (result !== undefined)
                    callback(result);
            }
        });
    }

    saveTabs(value) {
        chrome.storage.local.set({ tabs: JSON.stringify(value) });
    }

    saveSettings(name, value) {
        chrome.storage.local.set({ [name]: value });
    }

    getSettings(name, callback) {
        chrome.storage.local.get(name, function (item) {
            if (item !== undefined) {
                callback(item[name]);
            }
        });
    }
};