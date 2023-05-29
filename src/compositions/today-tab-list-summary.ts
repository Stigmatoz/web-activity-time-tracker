import { Tab } from '../entity/tab';
import { injectTabsRepository } from '../repository/inject-tabs-repository';
import { TabListSummary } from '../utils/tabListSummary';
import { todayLocalDate } from '../utils/today';

export async function useTodayTabListSummary(): Promise<TabListSummary> {
  const repo = await injectTabsRepository();
  const unSortedTabs = repo.getTodayTabs();
  let tabs: Tab[] = [];

  tabs = unSortedTabs.sort(function (a: Tab, b: Tab) {
    return (
      b.days.find(s => s.date === todayLocalDate())!.summary -
      a.days.find(s => s.date === todayLocalDate())!.summary
    );
  });

  const summaryTimeList = tabs?.map(function (tab) {
    return tab.days.find(day => day.date === todayLocalDate())!.summary;
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
  return {
    tabs,
    summaryTime,
    chart: {
      timeForChart,
      sitesForChart,
    },
  };
}
