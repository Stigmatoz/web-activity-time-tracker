import { TabListSummary } from '../dto/tabListSummary';
import { Tab } from '../entity/tab';
import { injectTabsRepository } from '../repository/inject-tabs-repository';
import { SortingBy } from '../utils/enums';
import { todayLocalDate } from '../utils/date';

export async function useTodayTabListSummary(sortingBy: SortingBy): Promise<TabListSummary | null> {
  const repo = await injectTabsRepository();
  const unSortedTabs = repo.getTodayTabs();
  let tabs: Tab[] = [];

  if (unSortedTabs.length == 0) return null;

  tabs = unSortedTabs.sort(function (a: Tab, b: Tab) {
    return sortingBy == SortingBy.UsageTime
      ? b.days.find(s => s.date === todayLocalDate())!.summary -
          a.days.find(s => s.date === todayLocalDate())!.summary
      : b.days.find(s => s.date === todayLocalDate())!.counter -
          a.days.find(s => s.date === todayLocalDate())!.counter;
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
