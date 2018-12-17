window.onload = function () {
    var table = document.getElementById('resultTable');
    var tabs = chrome.extension.getBackgroundPage().timer.tabs;
    for (var i = 0; i < tabs.length; i++) {
        var p = document.createElement('p');
        p.innerText = tabs[i];
        table.appendChild(p);
    }
};