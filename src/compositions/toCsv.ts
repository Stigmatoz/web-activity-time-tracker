import { DayTabs } from '../dto/tabListSummary';
import { useTabListByDays } from './tab-list-by-days';

const CSV_HEADER = 'Date,WebSite,Time(sec),Sessions\r\n';

export async function useImportToCsvWithData(days: DayTabs[] | undefined): Promise<string> {
  return getCsv(days);
}

export async function useImportToCsv(dateFrom: Date, dateTo: Date): Promise<string> {
  const summary = await useTabListByDays(dateFrom, dateTo);
  if (summary == null) return CSV_HEADER;

  return getCsv(summary.days);
}

function getCsv(days: DayTabs[] | undefined) {
  let str = CSV_HEADER;

  if (days != undefined && days.length > 0) {
    days.forEach(day => {
      let newLine = '';
      day.tabs.forEach(tab => {
        newLine += day.day + ',';
        newLine += tab.url + ',';
        newLine += tab.summaryTime + ',';
        newLine += tab.sessions;
        newLine += '\r\n';
      });
      str += newLine + '\r\n';
    });
  }

  return str;
}
