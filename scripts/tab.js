'use strict';class Tab{constructor(url,favicon,days,summary){this.url=url;this.favicon=favicon;if(summary!==undefined)
    this.summaryTime=summary;else this.summaryTime=0;if(days!==undefined)
    this.days=days;else this.days=[]}
    incSummaryTime(){this.summaryTime+=1;var today=new Date().toLocaleDateString();var day=this.days.find(x=>x.date==today);if(day===undefined){this.addNewDay(today)}
    else{day.summary+=1}}
    addNewDay(today){this.days.push({'date':today,'summary':1})}}