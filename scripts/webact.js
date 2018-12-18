window.onload = function () {
    var table = document.getElementById('resultTable');
    var tabs = chrome.extension.getBackgroundPage().timer.tabs;
    for (var i = 0; i < tabs.length; i++) {
        var div = document.createElement('div');
        div.classList.add('inline-flex');

        var img = document.createElement('img');
        img.setAttribute('height', 15);
        img.setAttribute('src', tabs[i].favicon);

        var span = document.createElement('span');
        span.innerText = tabs[i].url;
        span.classList.add('margin-left-5');

        div.appendChild(img);
        div.appendChild(span);
        table.appendChild(div);
    }
};