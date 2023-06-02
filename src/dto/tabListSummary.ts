import { Tab } from '../entity/tab';

export interface OverallStats extends TabListSummary {
  firstDay: Date;
  activeDaysTotal: number;
  daysTotal: number;
  todaySummaryTime: number;
  averageTimeByActiveDays: number;
  mostActiveDay: ActiveDay;
  mostInactiveDay: ActiveDay;
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
