import { CurrentTabItem } from '../dto/currentTabItem';
import { DayTabs, TabListByDays } from '../dto/tabListSummary';
import { injectTabsRepository } from '../repository/inject-tabs-repository';
import { isSameDay } from 'date-fns';

export async function useTabListByDays(
  dateFrom: Date,
  dateTo: Date,
): Promise<TabListByDays | null> {
  const repo = await injectTabsRepository();
  const unSortedTabs = repo.getTabs();
  let daysTabs: DayTabs[] = [];

  if (unSortedTabs.length == 0) return null;

  const isTheSameDay = isSameDay(dateFrom, dateTo);

  const unSortedTabsByDays = unSortedTabs.filter(x =>
    isTheSameDay
      ? x.days.find(s => isSameDay(new Date(s.date), dateFrom)) != undefined
      : x.days.find(s => new Date(s.date) >= dateFrom && new Date(s.date) <= dateTo) != undefined,
  );

  if (unSortedTabsByDays.length == 0)
    return {
      days: [],
      averageTime: 0,
      summaryTime: 0,
      sessions: 0,
    };

  unSortedTabsByDays.forEach(tab => {
    tab.days.forEach(day => {
      if (
        (new Date(day.date) >= dateFrom && new Date(day.date) <= dateTo) ||
        (isTheSameDay && isSameDay(new Date(day.date), dateFrom))
      ) {
        let dayTab = daysTabs.find(x => x.day == day.date);
        if (dayTab == undefined) {
          dayTab = {
            day: day.date,
            tabs: [],
            time: day.summary,
            sessions: day.counter,
          };
          dayTab.tabs.push({
            favicon: tab.favicon,
            url: tab.url,
            sessions: day.counter,
            summaryTime: day.summary,
          });
          daysTabs.push(dayTab);
        } else {
          dayTab.time += day.summary;
          dayTab.sessions += day.counter;
          dayTab.tabs.push({
            favicon: tab.favicon,
            url: tab.url,
            sessions: day.counter,
            summaryTime: day.summary,
          });
        }
      }
    });
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
