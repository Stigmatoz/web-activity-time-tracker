document.addEventListener('DOMContentLoaded', function () {
    var url = new URL(document.URL);
    var blockSiteUrl = url.searchParams.get("url");
    document.getElementById('site').innerText = blockSiteUrl;
});