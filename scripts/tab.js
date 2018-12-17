var Tab = function (domain, favicon) {
    this.url = domain;
    this.startTime = Date.now;
    this.favicon = favicon;
 };

Tab.prototype = {
    url: {},
    startTime: {},
    summaryTime: {},
    favicon: {},
    percentage: {}
};