'use strict';

class LocalStorage {
    load(name, callback){
        chrome.storage.local.get(name, function (item){
            if (item[name] !== undefined){
                var result = JSON.parse(item[name]);
                if (result !== undefined)
                    callback(result);
            }
        });
    }

    save(value){
        chrome.storage.local.set({tabs: JSON.stringify(value)});
    }
};