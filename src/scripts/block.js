'use strict';

var storage = new LocalStorage();
var blockSiteUrl;
var restrictionList = [];

document.addEventListener('DOMContentLoaded', function () {
    var url = new URL(document.URL);
    blockSiteUrl = url.searchParams.get("url");
    document.getElementById('site').innerText = extractHostname(blockSiteUrl);

    storage.getValue(STORAGE_RESTRICTION_LIST, function (items) {
        restrictionList = items;
        if (restrictionList === undefined)
            restrictionList = [];
        var currentItem = restrictionList.find(x => isDomainEquals(x.domain, blockSiteUrl));
        if (currentItem !== undefined){
            document.getElementById('limit').innerText = convertShortSummaryTimeToString(currentItem.time);
        }
    });

    document.getElementById('deffererBtn').addEventListener('click', function () {
        chrome.runtime.getBackgroundPage(function (bg) {
            let defList = bg.deferredRestrictionsList;
            if (defList == undefined)
                defList = [];
            defList.push({ site: blockSiteUrl, dateOfDeferred: new Date().getTime()});

            bg.deferredRestrictionsList = defList;

            chrome.tabs.query({ currentWindow: true, active: true }, function(tab) {
                chrome.tabs.update(tab.id, { url: blockSiteUrl });
            });
        });
    });
});