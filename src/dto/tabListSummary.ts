import { Tab } from '../entity/tab';
import { CurrentTabItem } from './currentTabItem';

export interface OverallStats extends TabListSummary {
  firstDay: Date;
  activeDaysTotal: number;
  daysTotal: number;
  todaySummaryTime: number;
  averageTimeByActiveDays: number;
  mostActiveDay: ActiveDay;
  mostInactiveDay: ActiveDay;
  mostActiveDayExceptToday: ActiveDay | null;
  mostInactiveDayExceptToday: ActiveDay | null;
}

export interface ActiveDay {
  date: Date;
  summaryTime: number;
}

export interface TabListSummary {
  tabs: Tab[];
  summaryTime: number;
  chart: DataForChart;
}

export interface DataForChart {
  timeForChart: number[];
  sitesForChart: string[];
}

export interface TabListByDays {
  days: DayTabs[];
  averageTime: number;
  summaryTime: number;
}

export interface DayTabs {
  day: string;
  tabs: CurrentTabItem[];
  time: number;
}
