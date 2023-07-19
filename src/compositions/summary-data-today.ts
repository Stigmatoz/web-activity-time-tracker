import { Tab } from '../entity/tab';
import { injectTabsRepository } from '../repository/inject-tabs-repository';
import { todayLocalDate } from '../utils/date';
import { DaySummary } from '../dto/daySummary';
import { startOfYesterday } from 'date-fns';
import { getPercentage } from '../utils/common';

export async function useWebUsageSummaryForDay(): Promise<DaySummary | null> {
  const repo = await injectTabsRepository();
  const unSortedTabs = repo.getTodayTabs();

  if (unSortedTabs.length == 0) return null;

  const dataToday = getData(todayLocalDate(), unSortedTabs);
  const dataYesterday = getData(startOfYesterday().toLocaleDateString('en-US'), unSortedTabs);

  return {
    time: dataToday?.time,
    mostVisitedSite: dataToday?.mostVisitedSite,
    mostVisitedSiteTime: dataToday?.mostVisitedSiteTime,
    timeYesterDay: dataYesterday?.time,
    percentageFromYesterday:
      dataToday == null
        ? '0%'
        : dataYesterday == null
        ? '100%'
        : `${getPercentage(dataToday.time, dataYesterday.time)}%`,
  };
}

function getData(date: string, unSortedTabs: Tab[]) {
  if (unSortedTabs.find(x => x.days.find(d => d.date == date)) == null) return null;
  const tabs = unSortedTabs.sort(function (a: Tab, b: Tab) {
    return b.days.find(s => s.date === date)!.summary - a.days.find(s => s.date === date)!.summary;
  });

  const summaryTimeList = tabs?.map(function (tab) {
    return tab.days.find(day => day.date === date)!.summary;
  });

  const summaryTime =
    summaryTimeList != undefined && summaryTimeList.length > 0
      ? summaryTimeList.reduce(function (a, b) {
          return a + b;
        })
      : 0;

  const mostVisitedTab = tabs[0];
  const mostVisitedSite = mostVisitedTab.url;
  const mostVisitedSiteTime = mostVisitedTab.days.find(s => s.date === date)?.summary!;

  return {
    time: summaryTime,
    mostVisitedSite: mostVisitedSite,
    mostVisitedSiteTime: mostVisitedSiteTime,
  };
}
