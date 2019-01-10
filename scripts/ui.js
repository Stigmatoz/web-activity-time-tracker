'use strict';

class UI {
    getTableOfSite() {
        return document.getElementById('resultTable');
    }

    setUIForToday() {
        document.getElementById('btnToday').classList.add('active');
        document.getElementById('btnAll').classList.remove('active');
        document.getElementById('btnByDays').classList.remove('active');

        this.clearUI();
    }

    setUIForAll() {
        document.getElementById('btnAll').classList.add('active');
        document.getElementById('btnToday').classList.remove('active');
        document.getElementById('btnByDays').classList.remove('active');

        this.clearUI();
    }

    setUIForByDays() {
        document.getElementById('btnByDays').classList.add('active');
        document.getElementById('btnAll').classList.remove('active');
        document.getElementById('btnToday').classList.remove('active');

        this.clearUI();
        this.addBlockForCalendar();
    }

    clearUI() {
        document.getElementById('resultTable').innerHTML = null;
        document.getElementById('chart').innerHTML = null;
        document.getElementById('total').innerHTML = null;
        document.getElementById('byDays').innerHTML = null;
    }

    createTotalBlock(totalTime) {
        var totalElement = document.getElementById('total');

        var spanTitle = document.createElement('span');
        spanTitle.classList.add('span-total');
        spanTitle.innerHTML = 'Total';

        var spanTime = document.createElement('span');
        spanTime.classList.add('span-time');
        spanTime.innerHTML = convertSummaryTimeToString(totalTime);

        totalElement.appendChild(spanTitle);
        totalElement.appendChild(spanTime);
    }

    fillEmptyBlock() {
        document.getElementById('chart').innerHTML = '<p class="no-data">No data</p>';
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
            .width(480)
            .height(280)
            .cornerRadius(5) // sets how rounded the corners are on each slice
            .padAngle(0.020) // effectively dictates the gap between slices
            .variable('percentage')
            .category('url');

        d3.select('#chart')
            .datum(tabs) // bind data to the div
            .call(donut); // draw chart in div

        ui.addHrAfterChart();
    }

    addTableHeader(currentTypeOfList, totalDays) {
        var p = document.createElement('p');
        p.classList.add('table-header');
        if (currentTypeOfList === TypeListEnum.ToDay)
            p.innerHTML = 'Today';
        if (currentTypeOfList === TypeListEnum.All && totalDays !== undefined) {
            if (totalDays.countOfDays > 0) {
                p.innerHTML = 'Aggregate data since ' + totalDays.minDate + ' (' + totalDays.countOfDays + ' days)';
            } else {
                p.innerHTML = 'Aggregate data since ' + today;
            }
        }

        this.getTableOfSite().appendChild(p);
    }

    addLineToTableOfSite(tab, currentTab, summaryTime) {
        var div = document.createElement('div');
        div.classList.add('inline-flex');

        var img = document.createElement('img');
        img.classList.add('favicon');
        img.setAttribute('height', 15);
        img.setAttribute('src', tab.favicon);

        var spanUrl = document.createElement('span');
        spanUrl.classList.add('span-url');
        spanUrl.innerText = tab.url;
        if (tab.url == currentTab) {
            spanUrl.classList.add('span-active-url');
        }

        var spanPercentage = document.createElement('span');
        spanPercentage.classList.add('span-percentage');
        spanPercentage.innerText = getPercentage(summaryTime);

        var spanTime = document.createElement('span');
        spanTime.classList.add('span-time');
        spanTime.innerText = convertSummaryTimeToString(summaryTime);

        div.appendChild(img);
        div.appendChild(spanUrl);
        div.appendChild(spanPercentage);
        div.appendChild(spanTime);
        this.getTableOfSite().appendChild(div);
    }

    addBlockForCalendar() {
        var div = document.getElementById('byDays');

        var from = document.createElement('span');
        from.innerHTML = 'From';
        var to = document.createElement('span');
        to.innerHTML = 'To';

        var dateNow = new Date();
        var calendarFirst = document.createElement('input');
        calendarFirst.id = 'dateFrom';
        calendarFirst.type = 'date';
        var previousDate = new Date(Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()));
        previousDate.setDate(previousDate.getDate() - 7);
        calendarFirst.valueAsDate = previousDate;

        var calendarTwo = document.createElement('input');
        calendarTwo.id = 'dateTo';
        calendarTwo.type = 'date';
        calendarTwo.valueAsDate = new Date(Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()));

        div.appendChild(from);
        div.appendChild(calendarFirst);
        div.appendChild(to);
        div.appendChild(calendarTwo);
    }

    getDateRange() {
        return {
            'from': new Date(document.getElementById('dateFrom').value).toLocaleDateString(),
            'to': new Date(document.getElementById('dateTo').value).toLocaleDateString()
        };
    }
}