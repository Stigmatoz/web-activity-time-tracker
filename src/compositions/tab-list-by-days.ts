import { DayTabs, TabListByDays } from '../dto/tabListSummary';
import { injectTabsRepository } from '../repository/inject-tabs-repository';

export async function useTabListByDays(dateFrom: Date, dateTo: Date): Promise<TabListByDays> {
  const repo = await injectTabsRepository();
  const unSortedTabs = repo.getTabs();
  let daysTabs: DayTabs[] = [];

  const unSortedTabsByDays = unSortedTabs.filter(
    x => x.days.find(s => new Date(s.date) >= dateFrom && new Date(s.date) <= dateTo) != undefined,
  );

  unSortedTabsByDays.forEach(tab => {
    tab.days.forEach(day => {
      if (new Date(day.date) >= dateFrom && new Date(day.date) <= dateTo) {
        let dayTab = daysTabs.find(x => x.day == day.date);
        if (dayTab == undefined) {
          dayTab = {
            day: day.date,
            tabs: [],
            time: day.summary,
          };
          dayTab.tabs.push({
            favicon: tab.favicon,
            url: tab.url,
            sessions: day.counter,
            summaryTime: day.summary,
            summaryTimeForCurrent: day.summary,
          });
          daysTabs.push(dayTab);
        } else {
          dayTab.time += day.summary;
          dayTab.tabs.push({
            favicon: tab.favicon,
            url: tab.url,
            sessions: day.counter,
            summaryTime: day.summary,
            summaryTimeForCurrent: day.summary,
          });
        }
      }
    });
  });

  daysTabs = daysTabs.sort(function (a, b) {
    return new Date(a.day).valueOf() - new Date(b.day).valueOf();
  });

  const summaryTime = daysTabs
    .map(x => x.time)
    .reduce(function (a, b) {
      return a + b;
    });

  const averageTime = Math.round(summaryTime / daysTabs.length);

  return {
    days: daysTabs,
    summaryTime: summaryTime,
    averageTime: averageTime,
  };
}
