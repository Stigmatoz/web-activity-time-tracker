var storage = new LocalStorage();
var restrictionList = [];

document.addEventListener('DOMContentLoaded', function () {
    var url = new URL(document.URL);
    var blockSiteUrl = url.searchParams.get("url");
    document.getElementById('site').innerText = blockSiteUrl;

    storage.getValue(STORAGE_RESTRICTION_LIST, function (items) {
        restrictionList = items;
        if (restrictionList === undefined)
            restrictionList = [];
        var currentItem = restrictionList.find(x => isDomainEquals(x.domain, blockSiteUrl));
        if (currentItem !== undefined){
            document.getElementById('limit').innerText = convertShortSummaryTimeToString(currentItem.time);
        }
    });
});