'use strict';

class LocalStorage {
    load(name){
        chrome.storage.local.get(name, function (item){
            return item[name];
        });
    }

    save(name, value){
        chrome.storage.local.set(name);
    }
};