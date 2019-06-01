//start connection in content script
let contentPort = chrome.runtime.connect({
    name: 'background-content'
});

//Listen for runtime message
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'CHECK_VIDEO') {
        var value = isVideoPlayedOnPage();
        sendResponse({ value: value });
    }
});

function isVideoPlayedOnPage() {
    var videoElement = document.getElementsByTagName('video')[0];
    if (videoElement !== undefined && videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2) {
        return true;
    }
    else return false;
}