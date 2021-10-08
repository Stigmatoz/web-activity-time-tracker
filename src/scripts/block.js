"use strict";

var storage = new LocalStorage();
var blockSiteUrl;
var restrictionList = [];

document.addEventListener("DOMContentLoaded", function () {
  var url = new URL(document.URL);
  blockSiteUrl = new Url(url.searchParams.get("url"));
  document.getElementById("site").innerText = blockSiteUrl;

  storage.getValue(STORAGE_RESTRICTION_LIST, function (items) {
    restrictionList = (items || []).map(item => new Restriction(item.url || item.domain, item.time));
    if (restrictionList === undefined) restrictionList = [];
    var currentItem = restrictionList.find(x => x.url.isMatch(blockSiteUrl));
    if (currentItem !== undefined) {
      document.getElementById("site").innerText = currentItem.url.toString();
      document.getElementById("limit").innerText =
        convertShortSummaryTimeToString(currentItem.time);
    }
  });

  storage.getValue(SETTINGS_BLOCK_DEFERRAL, function (item) {
    var deferBtn = document.getElementById("deffererBtn");
    if (item) {
      deferBtn.addEventListener("click", function () {
        chrome.runtime.getBackgroundPage(function (bg) {
          let defList = bg.deferredRestrictionsList;
          if (defList == undefined) defList = [];
          defList.push({
            site: blockSiteUrl,
            dateOfDeferred: new Date().getTime(),
          });

          bg.deferredRestrictionsList = defList;

          chrome.tabs.query(
            { currentWindow: true, active: true },
            function (tab) {
              chrome.tabs.update(tab.id, { url: blockSiteUrl.href });
            }
          );
        });
      });
    } else {
      deferBtn.remove();
    }
  });
});
