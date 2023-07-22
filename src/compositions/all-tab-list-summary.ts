import { ActiveDay, OverallStats } from '../dto/tabListSummary';
import { Tab, TabDay } from '../entity/tab';
import { injectTabsRepository } from '../repository/inject-tabs-repository';
import { SortingBy } from '../utils/enums';
import { daysBetween } from '../utils/time';
import { todayLocalDate } from '../utils/date';

export async function useAllTabListSummary(sortingBy: SortingBy): Promise<OverallStats | null> {
  const repo = await injectTabsRepository();
  const unSortedTabs = repo.getTabs();
  let tabs: Tab[] = [];

  if (unSortedTabs.length == 0) return null;
  const todayTabs = unSortedTabs?.filter(x => x.days.find(s => s.date === todayLocalDate()));

  const summaryTimeListForToday = todayTabs.map(function (tab) {
    return tab.days.find(day => day.date === todayLocalDate())!.summary;
  });

  const todaySummaryTime =
    summaryTimeListForToday != undefined && summaryTimeListForToday.length > 0
      ? summaryTimeListForToday.reduce(function (a, b) {
          return a + b;
        })
      : 0;

  tabs = unSortedTabs.sort(function (a: Tab, b: Tab) {
    return b.summaryTime - a.summaryTime;
  });

  let days: TabDay[] = [];
  tabs.map(function (tab) {
    return tab.days.forEach(function (day) {
      const existDay = days.find(x => x.date == day.date);
      if (!existDay) days.push(day);
      else {
        existDay.summary += day.summary;
        existDay.counter += day.counter;
      }
    });
  });

  days = days.sort(function (a, b) {
    return new Date(a.date).valueOf() - new Date(b.date).valueOf();
  });

  const mostDayExceptToday = fillMostListWithoutToday(days);

  const firstDay = new Date(days[0].date);
  const activeDaysTotal = days.length;

  if (sortingBy == SortingBy.Sessions)
    tabs = unSortedTabs.sort(function (a: Tab, b: Tab) {
      return b.counter - a.counter;
    });

  const summaryTimeList = tabs?.map(function (tab) {
    return tab.summaryTime;
  });
  const siteList = tabs?.map(function (tab) {
    return tab.url;
  });
  const timeForChart = summaryTimeList?.slice(0, 10);
  const sitesForChart = siteList?.slice(0, 10);

  const summaryTime =
    summaryTimeList != undefined && summaryTimeList.length > 0
      ? summaryTimeList.reduce(function (a, b) {
          return a + b;
        })
      : 0;

  const averageTimeByActiveDays = Math.round(summaryTime / activeDaysTotal);
  const daysTotal = daysBetween(firstDay, new Date(days[days.length - 1].date));

  const mostDay = fillMostList(days);

  return {
    firstDay: firstDay,
    daysTotal: daysTotal,
    activeDaysTotal: activeDaysTotal,
    todaySummaryTime: todaySummaryTime,
    averageTimeByActiveDays: averageTimeByActiveDays,
    mostActiveDay: mostDay.mostActiveDayObj,
    mostInactiveDay: mostDay.mostInactiveDayObj,
    mostActiveDayExceptToday:
      mostDayExceptToday != null ? mostDayExceptToday.mostActiveDayObjExceptToday : null,
    mostInactiveDayExceptToday:
      mostDayExceptToday != null ? mostDayExceptToday.mostInactiveDayObjExceptToday : null,
    tabs: tabs,
    summaryTime: summaryTime,
    chart: {
      timeForChart,
      sitesForChart,
    },
  };
}

function fillMostDay(mostDat: TabDay): ActiveDay {
  return {
    date: new Date(mostDat.date),
    summaryTime: mostDat.summary,
  };
}

function fillMostListWithoutToday(days: TabDay[]) {
  const daysWithoutToday = days
    .filter(x => x.date != todayLocalDate())
    .sort(function (a, b) {
      return new Date(a.date).valueOf() - new Date(b.date).valueOf();
    });

  const sortedByTimeDaysWithoutToday = daysWithoutToday.sort(function (a, b) {
    return a.summary - b.summary;
  });

  if (sortedByTimeDaysWithoutToday.length == 0) return null;
  const mostActiveDayExceptToday =
    sortedByTimeDaysWithoutToday[sortedByTimeDaysWithoutToday.length - 1];
  const mostActiveDayObjExceptToday = fillMostDay(mostActiveDayExceptToday);

  const mostInactiveDayExceptToday = sortedByTimeDaysWithoutToday[0];
  const mostInactiveDayObjExceptToday = fillMostDay(mostInactiveDayExceptToday);

  return {
    mostActiveDayObjExceptToday,
    mostInactiveDayObjExceptToday,
  };
}

function fillMostList(days: TabDay[]) {
  const sortedByTimeDays = days.sort(function (a, b) {
    return a.summary - b.summary;
  });

  const mostActiveDay = sortedByTimeDays[sortedByTimeDays.length - 1];
  const mostActiveDayObj = fillMostDay(mostActiveDay);

  const mostInactiveDay = sortedByTimeDays[0];
  const mostInactiveDayObj = fillMostDay(mostInactiveDay);

  return {
    mostActiveDayObj,
    mostInactiveDayObj,
  };
}
