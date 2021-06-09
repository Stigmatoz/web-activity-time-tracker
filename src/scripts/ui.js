'use strict';

class UI {
    getTableOfSite() {
        return document.getElementById('resultTable');
    }

    setUIForToday() {
        document.getElementById('btnToday').classList.add('active');
        document.getElementById('btnAll').classList.remove('active');
        document.getElementById('btnByDays').classList.remove('active');
        document.getElementById('blockForChartBtn').classList.remove('hide');
        document.getElementById('stats').classList.add('hide');
        document.getElementById('labelForTimeInterval').classList.add('hide');
        this.setUIForDonutChart();

        this.clearUI();
    }

    setUIForAll() {
        document.getElementById('btnAll').classList.add('active');
        document.getElementById('btnToday').classList.remove('active');
        document.getElementById('btnByDays').classList.remove('active');
        document.getElementById('blockForChartBtn').classList.add('hide');
        document.getElementById('stats').classList.remove('hide');
        document.getElementById('labelForTimeInterval').classList.add('hide');

        this.clearUI();
    }

    setUIForByDays(range) {
        document.getElementById('btnByDays').classList.add('active');
        document.getElementById('btnAll').classList.remove('active');
        document.getElementById('btnToday').classList.remove('active');
        document.getElementById('blockForChartBtn').classList.add('hide');
        document.getElementById('stats').classList.add('hide');
        document.getElementById('labelForTimeInterval').classList.add('hide');

        this.clearUI();
        this.addBlockForCalendar(range);
    }

    clearUI() {
        document.getElementById('resultTable').innerHTML = null;
        document.getElementById('chart').innerHTML = null;
        document.getElementById('timeChart').innerHTML = null;
        document.getElementById('total').innerHTML = null;
        document.getElementById('byDays').innerHTML = null;
    }

    setUIForDonutChart() {
        document.getElementById('donutChartBtn').classList.add('active');
        document.getElementById('heatMapChartBtn').classList.remove('active');
        document.getElementById('timeChart').innerHTML = null;
        document.getElementById('labelForTimeInterval').classList.add('hide');
    }

    setUIForTimeChart() {
        document.getElementById('donutChartBtn').classList.remove('active');
        document.getElementById('heatMapChartBtn').classList.add('active');
        document.getElementById('chart').innerHTML = null;
        document.getElementById('labelForTimeInterval').classList.remove('hide');
    }

    createTotalBlock(totalTime, currentTypeOfList, counter) {
        var totalElement = document.getElementById('total');

        var spanVisits = this.createElement('span', ['span-visits', 'tooltip', 'visits'], counter !== undefined ? counter : 0);
        var visitsTooltip = this.createElement('span', ['tooltiptext'], 'Count of visits');
        spanVisits.appendChild(visitsTooltip);

        var spanPercentage = this.createElement('span', ['span-percentage'], '100 %');

        var div = this.createElement('div', ['margin-left-5', 'total-block'], 'Total');
        var span = this.createElement('span', ['span-time']);
        this.createElementsForTotalTime(totalTime, currentTypeOfList, span);

        this.appendChild(totalElement, [div, spanVisits, spanPercentage, span]);
    }

    fillEmptyBlock(elementName) {
        document.getElementById(elementName).innerHTML = '<p class="no-data">No data</p>';
    }

    fillEmptyBlockForDaysIfInvalid() {
        document.getElementById('tableForDaysBlock').innerHTML = '<p class="no-data">Invalid date</p>';
    }

    fillEmptyBlockForDays() {
        document.getElementById('tableForDaysBlock').innerHTML = '<p class="no-data">No data</p>';
    }

    addHrAfterChart() {
        document.getElementById('chart').appendChild(document.createElement('hr'));
    }

    addHrAfterTableOfSite() {
        this.getTableOfSite().appendChild(document.createElement('hr'));
    }

    setActiveTooltipe(currentTab) {
        if (currentTab !== '') {
            var element = document.getElementById(currentTab);
            if (element !== null) {
                var event = new Event("mouseenter");
                document.getElementById(currentTab).dispatchEvent(event);
            }
        }
    }

    drawChart(tabs) {
        var donut = donutChart()
            .width(550)
            .height(230)
            .cornerRadius(5) // sets how rounded the corners are on each slice
            .padAngle(0.020) // effectively dictates the gap between slices
            .variable('percentage')
            .category('url');

        if (setting_dark_mode)
            donut.darkMode(true);
        else donut.darkMode(false);

        d3.select('#chart')
            .datum(tabs) // bind data to the div
            .call(donut); // draw chart in div
    }

    drawTimeChart(tabs) {
        drawIntervalChart(tabs);
    }

    drawBarChart(days) {
        d3.select('#barChart').datum(days);
        barChart(days);
    }

    addTableHeader(currentTypeOfList, counterOfSite, totalTime, totalDays) {
        function fillSummaryTime(totalTime){
            let arrayTime = getArrayTime(totalTime);
            let stringTime = '';
            if (arrayTime.days > 0) stringTime += arrayTime.days + ' days ';
            stringTime += arrayTime.hours + ' hours ';
            stringTime += arrayTime.mins + ' minutes ';
            return stringTime;
        }

        var p = document.createElement('p');
        p.classList.add('table-header');
        if (currentTypeOfList === TypeListEnum.ToDay)
            p.innerHTML = 'Today (' + counterOfSite + ' sites) <br> <strong>' + convertShortSummaryTimeToLongString(totalTime) + '</strong>';
        if (currentTypeOfList === TypeListEnum.All && totalDays !== undefined) {
            if (totalDays.countOfDays > 0) {
                p.innerHTML = 'Aggregate data since ' + new Date(totalDays.minDate).toLocaleDateString() + ' (' + totalDays.countOfDays + ' days) (' + counterOfSite + ' sites) <br> <strong>' + fillSummaryTime(totalTime)  + '</strong>';
            } else {
                p.innerHTML = 'Aggregate data since ' + new Date().toLocaleDateString() + ' (' + counterOfSite + ' sites) <br>  <strong>' + convertShortSummaryTimeToLongString(totalTime)  + '</strong>';
            }
        }

        this.getTableOfSite().appendChild(p);
    }

    addLineToTableOfSite(tab, currentTab, summaryTime, typeOfList, counter, blockName) {
        var div = document.createElement('div');
        div.addEventListener('mouseenter', function() {
            if (document.getElementById('chart').innerHTML !== '') {
                var item = document.getElementById(tab.url);
                if (item !== null) {
                    item.dispatchEvent(new Event('mouseenter'));
                    item.classList.add('mouse-over');
                } else {
                    document.getElementById('Others').dispatchEvent(new Event('mouseenter'));
                    document.getElementById('Others').classList.add('mouse-over');
                }
            }
        });
        div.addEventListener('mouseout', function() {
            if (document.getElementById('chart').innerHTML !== '') {
                var item = document.getElementById(tab.url);
                if (item !== null) {
                    item.classList.remove('mouse-over');
                } else document.getElementById('Others').classList.remove('mouse-over');
            }
        });
        div.classList.add('inline-flex');

        var divForImg = document.createElement('div');
        var img = document.createElement('img');
        img.setAttribute('height', 17);
        if (tab.favicon !== undefined || tab.favicon == null)
            img.setAttribute('src', tab.favicon);
        else img.setAttribute('src', '/icons/empty.png');
        divForImg.classList.add('block-img');
        divForImg.appendChild(img);

        var spanUrl = this.createElement('span', ['span-url'], tab.url);
        spanUrl.setAttribute('href', 'https://' + tab.url);

        if (tab.url == currentTab) {
            var divForImage = document.createElement('div');
            div.classList.add('span-active-url');
            var imgCurrentDomain = document.createElement('img');
            imgCurrentDomain.setAttribute('src', '/icons/eye.png');
            imgCurrentDomain.setAttribute('height', 17);
            imgCurrentDomain.classList.add('margin-left-5');
            divForImage.appendChild(imgCurrentDomain);
            var currentDomainTooltip = this.createElement('span', ['tooltiptext'], 'Current domain');
            divForImage.classList.add('tooltip', 'current-url');
            divForImage.appendChild(currentDomainTooltip);
            spanUrl.appendChild(divForImage);
        }

        if (typeOfList !== undefined && typeOfList === TypeListEnum.ToDay) {
            if (restrictionList !== undefined && restrictionList.length > 0) {
                var item = restrictionList.find(x => isDomainEquals(x.domain, tab.url));
                if (item !== undefined) {
                    var divLimit = this.createElement('div', ['tooltip', 'inline-block']);
                    var limitIcon = this.createElement('img', ['margin-left-5', 'tooltip']);
                    limitIcon.height = 15;
                    limitIcon.src = '/icons/limit.png';
                    var tooltip = this.createElement('span', ['tooltiptext'], "Daily limit is " + convertShortSummaryTimeToLongString(item.time));
                    divLimit = this.appendChild(divLimit, [limitIcon, tooltip]);
                    spanUrl.appendChild(divLimit);
                }
            }
        }

        var spanVisits = this.createElement('span', ['span-visits', 'tooltip', 'visits'], counter !== undefined ? counter : 0);
        var visitsTooltip = this.createElement('span', ['tooltiptext'], 'Count of visits');

        spanVisits.appendChild(visitsTooltip);

        var spanPercentage = this.createElement('span', ['span-percentage'], getPercentage(summaryTime));
        var spanTime = this.createElement('span', ['span-time']);
        this.createElementsForTotalTime(summaryTime, typeOfList, spanTime);

        div = this.appendChild(div, [divForImg, spanUrl, spanVisits, spanPercentage, spanTime]);
        if (blockName !== undefined)
            document.getElementById(blockName).appendChild(div);
        else
            this.getTableOfSite().appendChild(div);
    }

    createElementsForTotalTime(summaryTime, typeOfList, parentElement) {
        var arr = getArrayTime(summaryTime);
        var isNextPartActiv = false;
        var getCssClass = function(item) {
            if (item > 0) {
                isNextPartActiv = true;
                return ['span-active-time'];
            } else {
                if (isNextPartActiv)
                    return ['span-active-time'];
                return null;
            }
        };
        if (typeOfList === TypeListEnum.All) {
            var spanForDays = this.createElement('span', getCssClass(arr.days), arr.days + 'd ');
            this.appendChild(parentElement, [spanForDays]);
        }
        var spanForHour = this.createElement('span', getCssClass(arr.hours), arr.hours + 'h ');
        var spanForMin = this.createElement('span', getCssClass(arr.mins), arr.mins + 'm ');
        var spanForSec = this.createElement('span', getCssClass(arr.seconds), arr.seconds + 's ');
        this.appendChild(parentElement, [spanForHour, spanForMin, spanForSec]);
    }

    addExpander() {
        if (document.getElementById('expander') === null) {
            var div = this.createElement('div', ['expander'], 'Show all');
            div.id = 'expander';
            div.addEventListener('click', function() {
                ui.expand();
            });
            this.getTableOfSite().appendChild(div);
        }
    }

    expand() {
        getTabsForExpander();
        this.getTableOfSite().removeChild(document.getElementById('expander'));
    }

    addBlockForCalendar(range) {
        var div = document.getElementById('byDays');
        var barChart = document.createElement('div');
        barChart.id = 'barChart';

        var from = this.createElement('span', null, 'From');
        var to = this.createElement('span', null, 'To');

        var calendarFirst = document.createElement('input');
        calendarFirst.id = 'dateFrom';
        calendarFirst.type = 'date';
        var previousDate = new Date();
        previousDate.setDate(previousDate.getDate() - getDateFromRange(range));
        calendarFirst.valueAsDate = new Date(Date.UTC(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate()));

        var calendarTwo = document.createElement('input');
        calendarTwo.id = 'dateTo';
        calendarTwo.type = 'date';
        calendarTwo.valueAsDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));

        var tableForDaysBlock = document.createElement('div');
        tableForDaysBlock.id = 'tableForDaysBlock';

        div = this.appendChild(div, [barChart, from, calendarFirst, to, calendarTwo]);

        div.append(tableForDaysBlock);

        document.getElementById('dateFrom').addEventListener('change', function() {
            getTabsByDays(tabsFromStorage);
        });

        document.getElementById('dateTo').addEventListener('change', function() {
            getTabsByDays(tabsFromStorage);
        });
    }

    getDateRange() {
        return {
            'from': new Date(document.getElementById('dateFrom').value),
            'to': new Date(document.getElementById('dateTo').value)
        };
    }

    fillListOfDays(days, allDays) {
        var parent = document.getElementById('tableForDaysBlock');
        parent.innerHTML = null;
        document.getElementById('barChart').innerHTML = null;
        if (days.length > 0) {
            var daysForBarChart = this.fillDaysForBarChart(days, allDays);
            this.drawBarChart(daysForBarChart);

            var header = this.createElement('div', ['table-header']);

            var headerTitleDate = this.createElement('span', ['header-title-day'], 'Day');
            var headerTitleTime = this.createElement('span', ['header-title-time'], 'Summary time');

            header = this.appendChild(header, [headerTitleDate, headerTitleTime]);
            parent.appendChild(header);

            for (var i = 0; i < days.length; i++) {
                var check = this.createElement('input', ['toggle']);
                check.type = 'checkbox';
                check.id = days[i].date;

                var label = this.createElement('label', ['day-block', 'lbl-toggle']);
                label.setAttribute('for', days[i].date);
                var span = this.createElement('span', ['day'], new Date(days[i].date).toLocaleDateString());
                var spanTime = this.createElement('span', ['span-time']);
                this.createElementsForTotalTime(days[i].total, TypeListEnum.ByDays, spanTime);

                label = this.appendChild(label, [span, spanTime]);
                parent = this.appendChild(parent, [check, label]);

                var div = this.createElement('div', ['collapsible-content'], convertSummaryTimeToString(days[i].total));
                div.id = days[i].date + '_block';
                parent.appendChild(div);

                document.getElementById(days[i].date).addEventListener('click', function() {
                    var element = document.getElementById(this.id + '_block');
                    element.innerHTML = null;
                    getTabsFromStorageByDay(this.id, this.id + '_block')
                });
            }

        } else {
            this.fillEmptyBlock('tableForDaysBlock');
        }
    }

    fillDaysForBarChart(days, allDays) {
        var resultList = [];
        allDays.forEach(element => {
            var day = days.find(x => x.date == element);
            if (day !== undefined) {
                resultList.push({
                    'date': day.date,
                    'total': day.total
                });
            } else resultList.push({
                'date': element,
                'total': 0
            });
        });

        return resultList;
    }

    createElement(type, css, innerText) {
        var element = document.createElement(type);
        if (css !== undefined && css !== null) {
            for (let i = 0; i < css.length; i++)
                element.classList.add(css[i]);
        }
        if (innerText !== undefined)
            element.innerHTML = innerText;

        return element;
    }

    appendChild(element, children) {
        for (let i = 0; i < children.length; i++)
            element.appendChild(children[i]);

        return element;
    }

    setPreloader() {
        document.getElementById('preloader').classList.add('preloader');
    }

    setMode(){
        if (setting_dark_mode)
            document.body.classList.add('night-mode');
    }

    removePreloader() {
        document.getElementById('preloader').classList.remove('preloader');
        document.getElementById('preloader').classList.add('hide');
    }
}