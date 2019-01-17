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
});

loadSettings();

function loadSettings(){
    var options = storage.getSettings();
}