window.onload = function () {
    var resultTabs = {};
    //var tabs = chrome.extension.getBackgroundPage().timer.tabs;
    chrome.storage.sync.get('tabs', function(val){
        resultTabs = JSON.parse(val.tabs);
        getTabsFromStorage(resultTabs);
    });
};

function getTabsFromStorage(tabs){
    for (var i = 0; i < tabs.length; i++) {
        var table = document.getElementById('resultTable');
        var div = document.createElement('div');
        div.classList.add('inline-flex');

        var img = document.createElement('img');
        img.setAttribute('height', 15);
        img.setAttribute('src', tabs[i].favicon);

        var span = document.createElement('span');
        span.innerText = tabs[i].url + ' ' + tabs[i].summaryTime;
        span.classList.add('margin-left-5');

        div.appendChild(img);
        div.appendChild(span);
        table.appendChild(div);
    }
}