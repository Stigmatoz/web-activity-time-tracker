import { Tab } from '../entity/tab';

export interface TabListSummary {
  tabs: Tab[];
  summaryTime: number;
  chart: DataForChart;
}

export interface DataForChart {
  timeForChart: number[];
  sitesForChart: string[];
}
