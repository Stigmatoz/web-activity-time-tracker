import { CurrentTabItem } from '../dto/currentTabItem';
import { DayTabs, TabListByDays } from '../dto/tabListSummary';
import { injectTabsRepository } from '../repository/inject-tabs-repository';
import { isSameDay } from 'date-fns';

export async function useTabStatsByDays(
  dateFrom: Date,
  dateTo: Date,
  domain: string,
): Promise<TabListByDays | null> {
  const repo = await injectTabsRepository();
  const tab = repo.getTab(domain);
  let daysTabs: DayTabs[] = [];

  if (tab == undefined) return null;

  const isTheSameDay = isSameDay(dateFrom, dateTo);

  const unSortedTabsByDays = isTheSameDay
    ? tab.days.filter(s => isSameDay(new Date(s.date), dateFrom))
    : tab.days.filter(s => new Date(s.date) >= dateFrom && new Date(s.date) <= dateTo);

  if (unSortedTabsByDays.length == 0)
    return {
      days: [],
      averageTime: 0,
      summaryTime: 0,
      sessions: 0,
    };

  unSortedTabsByDays.forEach(tabDay => {
    if (
      (new Date(tabDay.date) >= dateFrom && new Date(tabDay.date) <= dateTo) ||
      (isTheSameDay && isSameDay(new Date(tabDay.date), dateFrom))
    ) {
      let dayTab = daysTabs.find(x => x.day == tabDay.date);
      if (dayTab == undefined) {
        dayTab = {
          day: tabDay.date,
          tabs: [],
          time: tabDay.summary,
          sessions: tabDay.counter,
        };
        dayTab.tabs.push({
          favicon: tab.favicon,
          url: tab.url,
          sessions: tabDay.counter,
          summaryTime: tabDay.summary,
        });
        daysTabs.push(dayTab);
      } else {
        dayTab.time += tabDay.summary;
        dayTab.sessions += tabDay.counter;
        dayTab.tabs.push({
          favicon: tab.favicon,
          url: tab.url,
          sessions: tabDay.counter,
          summaryTime: tabDay.summary,
        });
      }
    }
  });

  daysTabs.sort(function (a, b) {
    return new Date(a.day).valueOf() - new Date(b.day).valueOf();
  });

  daysTabs.forEach(dayTab => {
    dayTab.tabs.sort(function (a: CurrentTabItem, b: CurrentTabItem) {
      return b.summaryTime - a.summaryTime;
    });
  });

  const summaryTime = daysTabs
    .map(x => x.time)
    .reduce(function (a, b) {
      return a + b;
    });

  const totalSessions = daysTabs
    .map(x => x.sessions)
    .reduce(function (a, b) {
      return a + b;
    });

  const averageTime = Math.round(summaryTime / daysTabs.length);

  return {
    days: daysTabs,
    summaryTime: summaryTime,
    averageTime: averageTime,
    sessions: totalSessions,
  };
}
