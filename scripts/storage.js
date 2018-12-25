'use strict';

class LocalStorage {
    load(name){
        chrome.storage.local.get(name, function (item){
            if (item[name] !== undefined)
                return JSON.parse(item[name]);
        });
    }

    save(name, value){
        chrome.storage.local.set({name: JSON.stringify(value)});
    }
};