'use strict';

var tabsFromBackground;
var storage = new LocalStorage();
var ui = new UI();
var totalTime, averageTime;
var tabsFromStorage;
var targetTabs;
var currentTypeOfList;
var setting_range_days;
var setting_dark_mode;
var restrictionList;
var stat = {
    set firstDay(value) {
        document.getElementById('statFirstDay').innerHTML = value;
    },
    set activeDays(value) {
        document.getElementById('statActiveDays').innerHTML = value;
    },
    set totalDays(value) {
        document.getElementById('statTotalDays').innerHTML = value;
    },
    set inActiveDay(value) {
        document.getElementById('statInActiveDay').innerHTML = value;
        this.inActiveDayValue = value;
    },
    get inActiveDay() {
        return this.inActiveDayValue;
    },
    set inActiveDayWithoutCurrentDay(value) {
        document.getElementById('statInActiveDayWithoutCurrentDay').innerHTML = value;
        this.inActiveDayWithoutCurrentDayValue = value;
    },
    get inActiveDayWithoutCurrentDay() {
        return this.inActiveDayWithoutCurrentDayValue;
    },
    set inActiveDayTime(value) {
        document.getElementById('statInActiveDayTime').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statInActiveDayTime'));
        this.inActiveDayTimeValue = value;
    },
    get inActiveDayTime() {
        return this.inActiveDayTimeValue;
    },
    set inActiveDayTimeWithoutCurrentDay(value) {
        document.getElementById('statInActiveDayTimeWithoutCurrentDay').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statInActiveDayTimeWithoutCurrentDay'));
        this.inActiveDayTimeWithoutCurrentDayValue = value;
    },
    get inActiveDayTimeWithoutCurrentDay() {
        return this.inActiveDayTimeWithoutCurrentDayValue;
    },
    set activeDay(value) {
        document.getElementById('statActiveDay').innerHTML = value;
    },
    set activeDayWithoutCurrentDay(value) {
        document.getElementById('statActiveDayWithoutCurrentDay').innerHTML = value;
    },
    set averageTime(value) {
        document.getElementById('statAverageTime').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statAverageTime'));
    },
    set activeDayTime(value) {
        document.getElementById('statActiveDayTime').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statActiveDayTime'));
    },
    set activeDayTimeWithoutCurrentDay(value) {
        document.getElementById('statActiveDayTimeWithoutCurrentDay').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statActiveDayTimeWithoutCurrentDay'));
    },
    set todayTime(value) {
        document.getElementById('statTodayTime').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.ToDay, document.getElementById('statTodayTime'));
    },
    set allDaysTime(value) {
        document.getElementById('statAllDaysTime').innerHTML = '';
        ui.createElementsForTotalTime(value, TypeListEnum.All, document.getElementById('statAllDaysTime'));
    },
};

document.addEventListener('DOMContentLoaded', function () {
    ui.setPreloader();

    storage.getValue(SETTINGS_INTERVAL_RANGE, function (item) { setting_range_days = item; });
    document.getElementById('btnToday').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ToDay;
        ui.setUIForToday();
        getDataFromStorage();
    });
    document.getElementById('donutChartBtn').addEventListener('click', function () {
        ui.setUIForDonutChart();
        getDataFromStorage();
    });
    document.getElementById('heatMapChartBtn').addEventListener('click', function () {
        ui.setUIForTimeChart();
        getTimeIntervalList();
    });
    document.getElementById('btnAll').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.All;
        ui.setUIForAll();
        getDataFromStorage();
    });
    document.getElementById('btnByDays').addEventListener('click', function () {
        currentTypeOfList = TypeListEnum.ByDays;
        ui.setUIForByDays(setting_range_days);
        getDataFromStorageByDays();
    });
    document.getElementById('statInActiveDayIcon').addEventListener('click', function () {
        fillBlockWithInActiveDay();
    });
    document.getElementById('statActiveDayIcon').addEventListener('click', function () {
        fillBlockWithActiveDay();
    });
    document.getElementById('closeHintBtn').addEventListener('click', function () {
        document.getElementById('hintForUsers').classList.add('hide');
        storage.saveValue(SETTINGS_SHOW_HINT, false);
    });
    document.getElementById('settings').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
});

firstInitPage();

function firstInitPage() {
    chrome.runtime.getBackgroundPage(function (bg) {
        setting_dark_mode = bg.setting_dark_mode;
        ui.setMode();
        tabsFromBackground = bg.tabs;
        currentTypeOfList = TypeListEnum.ToDay;
        getLimitsListFromStorage();
        getDataFromStorage();
        storage.getValue(SETTINGS_SHOW_HINT, function (item) {
            if (item)
                document.getElementById('hintForUsers').classList.remove('hide');
        });
    });
}

window.addEventListener('click', function (e) {
    if (e.target.nodeName == 'SPAN' && e.target.className == 'span-url' && e.target.attributes.href.value != undefined){
        chrome.tabs.create({ url: e.target.attributes.href.value })
    }
});

function getLimitsListFromStorage(callback) {
    callback = callback || (() => {});
    if (!restrictionList) {
        storage.loadTabs(STORAGE_RESTRICTION_LIST, items => {
            getLimitsListFromStorageCallback(items);
            callback();
        });
    } else {
        callback();
    }
}

function getDataFromStorage() {
    if (tabsFromBackground != undefined && tabsFromBackground != null && tabsFromBackground.length > 0)
        getTabsFromStorage(tabsFromBackground);
    else fillEmptyBlock();
}

function getDataFromStorageByDays() {
    if (tabsFromBackground != undefined && tabsFromBackground != null && tabsFromBackground.length > 0)
        getTabsByDays(tabsFromBackground);
}

function getLimitsListFromStorageCallback(items) {
    restrictionList = (items || []).map(item => new Restriction(item.url, item.time));
}

function fillEmptyBlock() {
    ui.removePreloader();
    ui.fillEmptyBlock('chart');
}

function getTabsFromStorage(tabs) {
    tabsFromStorage = tabs;
    targetTabs = [];
  
    ui.clearUI();
    if (tabs === null) {
      ui.fillEmptyBlock("chart");
      return;
    }
  
    var counterOfSite;
    if (currentTypeOfList === TypeListEnum.All) {
        targetTabs = tabs;
      if (targetTabs.length > 0) {
        totalTime = getTotalTime(targetTabs, currentTypeOfList);
        stat.allDaysTime = totalTime;
      } else {
        ui.fillEmptyBlock("chart");
        return;
      }
  
      counterOfSite = tabs.length;
    }
    if (currentTypeOfList === TypeListEnum.ToDay) {
      targetTabs = tabs.filter((x) =>
        x.days.find((s) => s.date === todayLocalDate())
      );
      counterOfSite = targetTabs.length;
      if (targetTabs.length > 0) {
        targetTabs = targetTabs.sort(function (a, b) {
          return (
            b.days.find((s) => s.date === todayLocalDate()).summary -
            a.days.find((s) => s.date === todayLocalDate()).summary
          );
        });
  
        totalTime = getTotalTime(targetTabs, currentTypeOfList);
        stat.todayTime = totalTime;
      } else {
        ui.fillEmptyBlock("chart");
        return;
      }
    }
  
    if (currentTypeOfList === TypeListEnum.All)
      ui.addTableHeader(
        currentTypeOfList,
        counterOfSite,
        totalTime,
        getFirstDay()
      );
    if (currentTypeOfList === TypeListEnum.ToDay)
      ui.addTableHeader(currentTypeOfList, counterOfSite, totalTime);
  
    var currentTab = getCurrentTab();
  
    var tabsForChart = [];
    var summaryCounter = 0;
    var tabGroups = getTabGroups(targetTabs, currentTypeOfList);
  
    for (var i = 0; i < tabGroups.length; i++) {
      var summaryTime = 0;
      var counter = 0;
      var tabGroup = tabGroups[i];
  
      summaryTime = tabGroup.summaryTime;
      counter = tabGroup.counter;
  
      summaryCounter += counter;
  
      const targetTab = tabGroup.tabs.find(t => t.url.isMatch(currentTab)) || tabGroup.tabs[0];
  
      if (
        currentTypeOfList === TypeListEnum.ToDay ||
        (currentTypeOfList === TypeListEnum.All && i <= 30)
      )
        ui.addLineToTableOfSite(
          targetTab,
          currentTab,
          summaryTime,
          currentTypeOfList,
          counter
        );
      else ui.addExpander();
  
      var tabForChartUrl = i <= 8 ? tabGroup.host : 'Others';
      addTabForChart(tabsForChart, tabForChartUrl, summaryTime, counter);
    }
  
    ui.addHrAfterTableOfSite();
    ui.createTotalBlock(totalTime, currentTypeOfList, summaryCounter);
    ui.drawChart(tabsForChart);
    ui.setActiveTooltip(currentTab);
  
    ui.removePreloader();
  }  

function getTabsForTimeChart(timeIntervals) {
    var resultArr = [];
    if (timeIntervals != undefined) {
        timeIntervals.forEach(function (data) {
            if (data.day == todayLocalDate()) {
                data.intervals.forEach(function (interval) {
                    resultArr.push({ 'domain': data.url.host, 'interval': interval });
                });
            }
        });
    }

    return resultArr;
}

function getTabGroups(tabs, typeOfList, date) {
    var result = [];

    var tabGroups = groupTabsByHost(tabs);

    for(const host in tabGroups){
        var groupedTabs = tabGroups[host];

        result.push({
            host: host,
            counter: getTotalCount(groupedTabs, typeOfList, date),
            summaryTime: getTotalTime(groupedTabs, typeOfList, date),
            tabs: groupedTabs
        });
    }
    
    result.sort(function (a, b) {
        return b.summaryTime - a.summaryTime;
    });

    return result;
}

function groupTabsByHost(tabs) {
    var tabGroups = tabs.reduce((groups, tab) => {
        var key = tab.url.host;
        (groups[key] = groups[key] || []).push(tab);
        return groups;
      }, {});

      return tabGroups;
}

function getTabsForExpander() {
    if (tabsFromBackground != undefined && tabsFromBackground != null && tabsFromBackground.length > 0)
        getTabsFromStorageForExpander(tabsFromBackground);
}

function getTimeIntervalList() {
    storage.getValue(STORAGE_TIMEINTERVAL_LIST, drawTimeChart);
}

function drawTimeChart(items) {
    var timeIntervalList = [];
    items = items || [];

    for (var i = 0; i < items.length; i++) {
        timeIntervalList.push(new TimeInterval(items[i].day, items[i].url || items[i].domain, items[i].intervals));
    }

    ui.drawTimeChart(getTabsForTimeChart(timeIntervalList));
}

function getTabsFromStorageForExpander(tabs) {
    tabsFromStorage = tabs;
    targetTabs = [];

    var currentTab = getCurrentTab();
  
    var tabGroups = getTabGroups(tabs, currentTypeOfList);

    for (var i = 31; i < tabGroups.length; i++) {
        var tabGroup = tabGroups[i];
        ui.addLineToTableOfSite(tabGroup, currentTab, tabGroup.summaryTime, currentTypeOfList, tabGroup.counter);
    }

    var table = ui.getTableOfSite();
    table.removeChild(table.getElementsByTagName('hr')[0]);
    ui.addHrAfterTableOfSite();
}

function getTotalCount(tabs, typeofList, date) {
    var total;
    if (typeofList === TypeListEnum.ToDay) {
        date = date || todayLocalDate();
        total = tabs.reduce((tot, tab) => {
            let item = tab.days.find((x) => x.date == date);
            return tot + (item.counter || 0);
        }, 0);
    } else if (typeofList === TypeListEnum.All) {
        total = tabs.reduce((tot, tab) => tot + tab.counter, 0);
    }
  
    return total;
}
  

function getTotalTime(tabs, typeOfList, date) {
    var total;
    switch(typeOfList){
        case TypeListEnum.ByDays:
        case TypeListEnum.ToDay:
            date = date || todayLocalDate();
            var summaryTimeList = tabs.map(function (a) { return a.days.find(s => s.date === date).summary; });
            total = summaryTimeList.reduce(function (a, b) { return a + b; })
            break;
        case TypeListEnum.All:
            var summaryTimeList = tabs.map(function (a) { return a.summaryTime; });
            total = summaryTimeList.reduce(function (a, b) { return a + b; })
            break;
        default:               
    }

    return total;
}

function getTotalTimeForDay(day, tabs) {
    var total;
    var summaryTimeList = tabs.map(function (a) { return a.days.find(s => s.date === day).summary; });
    total = summaryTimeList.reduce(function (a, b) { return a + b; })
    return total;
}

function getPercentage(time) {
    return ((time / totalTime) * 100).toFixed(2) + ' %';
}

function getPercentageForChart(time) {
    return ((time / totalTime) * 100).toFixed(2) / 100;
}

function getCurrentTab() {
    return chrome.extension.getBackgroundPage().currentTab;
}

function addTabForChart(tabsForChart, url, summaryTime, counter) {
    var tab = tabsForChart.find(x => x.url == url);
    if (tab === undefined) {
        tabsForChart.push({
            'url': url,
            'percentage': getPercentageForChart(summaryTime),
            'summary': summaryTime,
            'visits': counter
        });
    } else {
        tab['summary'] += summaryTime;
        tab['percentage'] = getPercentageForChart(tab['summary']);
        tab['visits'] += counter;
    }
}

function getFirstDay() {
    var array = [];
    tabsFromStorage.map(function (a) {
        return a.days.map(function (a) {
            if (array.indexOf(a.date) === -1)
                return array.push(a.date);
        });
    });

    array = array.sort(function (a, b) {
        return new Date(a) - new Date(b);
    });

    setStatData(array);
    return {
        'countOfDays': array.length,
        'minDate': array[0]
    };
}

function setStatData(array) {
    var arrayAscByTime = [];
    var arrayAscByTimeWithoutCurrentDay = [];
    tabsFromStorage.forEach(tab => {
        return tab.days.forEach(day => {
            var item = arrayAscByTime.find(x => x.date == day.date);
            if (item !== undefined) {
                return item.total += day.summary;
            }
            if (item === undefined)
                return arrayAscByTime.push({
                    'date': day.date,
                    'total': day.summary
                });
        });
    });

    arrayAscByTimeWithoutCurrentDay = arrayAscByTime.filter(function (item) {
        return item.date != todayLocalDate();
    })

    arrayAscByTime = arrayAscByTime.sort(function (a, b) {
        return a.total - b.total;
    });

    arrayAscByTimeWithoutCurrentDay = arrayAscByTimeWithoutCurrentDay.sort(function (a, b) {
        return a.total - b.total;
    });

    stat.inActiveDay = new Date(arrayAscByTime[0].date).toLocaleDateString();
    stat.activeDay = new Date(arrayAscByTime[arrayAscByTime.length - 1].date).toLocaleDateString();;
    stat.inActiveDayTime = arrayAscByTime[0].total;
    stat.activeDayTime = arrayAscByTime[arrayAscByTime.length - 1].total;

    //exclude current day from summary statistics 
    if (arrayAscByTimeWithoutCurrentDay.length > 0) {
        stat.inActiveDayWithoutCurrentDay = new Date(arrayAscByTimeWithoutCurrentDay[0].date).toLocaleDateString();
        stat.activeDayWithoutCurrentDay = new Date(arrayAscByTimeWithoutCurrentDay[arrayAscByTimeWithoutCurrentDay.length - 1].date).toLocaleDateString();
        stat.inActiveDayTimeWithoutCurrentDay = arrayAscByTimeWithoutCurrentDay[0].total;
        stat.activeDayTimeWithoutCurrentDay = arrayAscByTimeWithoutCurrentDay[arrayAscByTimeWithoutCurrentDay.length - 1].total;
    }
    else {
        stat.activeDayWithoutCurrentDay = 'No data';
        stat.inActiveDayWithoutCurrentDay = 'No data';
    }

    stat.firstDay = new Date(array[0]).toLocaleDateString();;
    stat.activeDays = array.length;
    stat.averageTime = Math.round(totalTime / array.length);
    stat.totalDays = daysBetween(array[0], array[array.length - 1]);
}

function getTabsByDays(tabs) {
    var range = ui.getDateRange();
    if (tabs === undefined) {
        ui.fillEmptyBlockForDays();
        return;
    }
    if (range.from !== 'Invalid Date' && range.to !== 'Invalid Date' && isCorrectDate(range)) {
        var listOfDays = [];
        tabs.forEach(tab => {
            return tab.days.forEach(day => {
                var item = listOfDays.find(x => x.date == day.date);
                if (item !== undefined) {
                    return item.total += day.summary;
                }
                if (item === undefined && isDateInRange(day.date, range))
                    return listOfDays.push({
                        'date': day.date,
                        'total': day.summary
                    });
            });
        });
        listOfDays = listOfDays.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        var getDaysArray = function (start, end) {
            let first = start;
            let second = end;
            var arr = [];
            for (let i = first; i <= second; i = new Date(i.setDate(i.getDate() + 1))) {
                arr.push(new Date(i).toLocaleDateString("en-US"));
            }
            return arr;
        };
        ui.fillListOfDays(listOfDays, getDaysArray(range.from, range.to));
    } else {
        ui.fillEmptyBlockForDaysIfInvalid();
    }
}

function getTabsFromStorageByDay(day, blockName) {
    targetTabs = [];

    if (tabsFromStorage === null) {
        ui.fillEmptyBlock(blockName);
        return;
    }

    targetTabs = tabsFromStorage.filter(x => x.days.find(s => s.date === day));
    if (targetTabs.length > 0) {
        targetTabs = targetTabs.sort(function (a, b) {
            return b.days.find(s => s.date === day).summary - a.days.find(s => s.date === day).summary;
        });

        totalTime = getTotalTimeForDay(day, targetTabs);
    } else {
        ui.fillEmptyBlock(blockName);
        return;
    }

    var currentTab = getCurrentTab();

    var content = document.createElement('div');
    content.classList.add('content-inner');
    content.id = blockName + '_content';
    document.getElementById(blockName).appendChild(content);

    var tabGroups = getTabGroups(targetTabs, TypeListEnum.ByDays, day);

    for (const tabGroup of tabGroups){
        var summaryTime = tabGroup.summaryTime;
        var counter = tabGroup.counter;
        const targetTab = tabGroup.tabs.find(t => t.url.isMatch(currentTab)) || tabGroup.tabs[0];

        ui.addLineToTableOfSite(targetTab, currentTab, summaryTime, TypeListEnum.ByDays, counter, blockName + '_content');
    }
}

function fillBlockWithInActiveDay() {
    var flag = document.getElementById('statInActiveDayIcon').dataset.today;
    if (flag == 'true')
        fillValuesForBlockWithInActiveDay("statInActiveDay", stat.inActiveDayWithoutCurrentDay, stat.inActiveDayTimeWithoutCurrentDay, flag);
    else
        fillValuesForBlockWithInActiveDay("statInActiveDay", stat.inActiveDay, stat.inActiveDayTime, flag);
}

function fillBlockWithActiveDay() {
    var flag = document.getElementById('statActiveDayIcon').dataset.today;
    if (flag == 'true')
        fillValuesForBlockWithInActiveDay("statActiveDay", stat.activeDayWithoutCurrentDay, stat.activeDayTimeWithoutCurrentDay, flag);
    else
        fillValuesForBlockWithInActiveDay("statActiveDay", stat.activeDay, stat.activeDayTime, flag);
}

function fillValuesForBlockWithInActiveDay(prefix, dayValue, timeValue, flag) {
    if (flag == 'true') {
        document.getElementById(prefix).classList.add('hide');
        document.getElementById(prefix + 'Time').classList.add('hide');
        document.getElementById(prefix + 'WithoutCurrentDay').classList.remove('hide');
        document.getElementById(prefix + 'TimeWithoutCurrentDay').classList.remove('hide');

        document.getElementById(prefix + 'Title').innerHTML = 'Include the current day in the calculation of statistics';
        document.getElementById(prefix + 'Icon').dataset.today = false;
        document.getElementById(prefix + 'Icon').src = "/icons/no-today.svg";

        document.getElementById(prefix + 'WithoutCurrentDay').value = dayValue;
        document.getElementById(prefix + 'TimeWithoutCurrentDay').value = timeValue;
    }
    else {
        document.getElementById(prefix).classList.remove('hide');
        document.getElementById(prefix + 'Time').classList.remove('hide');
        document.getElementById(prefix + 'WithoutCurrentDay').classList.add('hide');
        document.getElementById(prefix + 'TimeWithoutCurrentDay').classList.add('hide');

        document.getElementById(prefix + 'Title').innerHTML = "Don't Include the current day in the calculation of statistics";
        document.getElementById(prefix + 'Icon').dataset.today = true;
        document.getElementById(prefix + 'Icon').src = "/icons/today.svg";

        document.getElementById(prefix).value = dayValue;
        document.getElementById(prefix + 'Time').value = timeValue;
    }
}