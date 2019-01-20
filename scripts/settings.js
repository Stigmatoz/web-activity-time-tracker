var storage = new LocalStorage();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settingsBtn').addEventListener('click', function () {
        document.getElementById('settingsBtn').classList.add('active');
        document.getElementById('aboutBtn').classList.remove('active');

        document.getElementById('settingsBlock').hidden = false;
        document.getElementById('aboutBlock').hidden = true;
    });
    document.getElementById('aboutBtn').addEventListener('click', function () {
        document.getElementById('settingsBtn').classList.remove('active');
        document.getElementById('aboutBtn').classList.add('active');

        document.getElementById('settingsBlock').hidden = true;
        document.getElementById('aboutBlock').hidden = false;
    });
    document.getElementById('clearAllData').addEventListener('click', function () {
        clearAllData();
    });
});

loadSettings();

function loadSettings(){
    storage.getSettings(SETTINGS_INTERVAL_INACTIVITY, function (item){
        document.getElementById('intervalInactivity').value = item;
    });
    storage.getSettings(SETTINGS_INTERVAL_RANGE, function (item){
        document.getElementById('rangeToDays').value = item;
    });
    storage.getSettings(SETTINGS_VIEW_TIME_IN_BADGE, function (item){
        document.getElementById('viewTimeInBadge').setAttribute('checked', item);
    });
    // storage.getSettings(SETTINGS_INTERVAL_SAVE_STORAGE, function (item){
    //     document.getElementById('intervalInactivity').value = item;
    // });
}

function clearAllData(){
    storage.saveTabs(null);
}