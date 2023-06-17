import { endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import startOfToday from 'date-fns/startOfToday';

export function todayLocalDate() {
  return new Date().toLocaleDateString('en-US');
}

export function getToday(): number {
  return startOfToday().getTime();
}

export const TodayRange = [new Date(), new Date()];
export const ThisWeekRange = [startOfWeek(new Date()), endOfWeek(new Date())];
export const ThisMonthRange = [startOfMonth(new Date()), endOfMonth(new Date())];
export const LatMonthRange = [
  startOfMonth(subMonths(new Date(), 1)),
  endOfMonth(subMonths(new Date(), 1)),
];

export function ranges() {
  return [
    { label: 'Today', range: TodayRange },
    { label: 'This week', range: ThisWeekRange },
    { label: 'This month', range: ThisMonthRange },
    {
      label: 'Last month',
      range: LatMonthRange,
    },
  ];
}
