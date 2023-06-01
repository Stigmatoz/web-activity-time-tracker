import { TabListSummary } from '../dto/tabListSummary';
import { Tab } from '../entity/tab';
import { injectTabsRepository } from '../repository/inject-tabs-repository';
import { SortingBy } from '../utils/enums';

export async function useAllTabListSummary(sortingBy: SortingBy): Promise<TabListSummary> {
  const repo = await injectTabsRepository();
  const unSortedTabs = repo.getTabs();
  let tabs: Tab[] = [];

  tabs = unSortedTabs.sort(function (a: Tab, b: Tab) {
    return b.summaryTime - a.summaryTime;
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
  return {
    tabs,
    summaryTime,
    chart: {
      timeForChart,
      sitesForChart,
    },
  };
}
