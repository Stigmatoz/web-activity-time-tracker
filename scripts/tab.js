var Tab = function (domain, favicon) {
    this.url = domain;
    this.startTime = new Date();
    this.favicon = favicon;
 };

Tab.prototype = {
    url: {},
    startTime: {},
    summaryTime: {},
    favicon: {},
    percentage: {},

    start: function(){
        this.startTime = new Date();
    },

    stop: function(){
        this.summaryTime = new Date() - this.startTime;
        this.startTime = null;
    }
};