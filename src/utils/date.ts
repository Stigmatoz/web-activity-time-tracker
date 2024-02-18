import i18n from '../plugins/i18n';
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
    { label: i18n.global.t('today.message'), range: TodayRange },
    { label: i18n.global.t('week.message'), range: ThisWeekRange },
    { label: i18n.global.t('month.message'), range: ThisMonthRange },
    {
      label: i18n.global.t('lastMonth.message'),
      range: LatMonthRange,
    },
  ];
}

export function isDateEqual(first: Date, second: Date) {
  return (
    first.getFullYear() == second.getFullYear() &&
    first.getMonth() == second.getMonth() &&
    first.getDate() == second.getDate() &&
    first.getHours() == second.getHours() &&
    first.getMinutes() == second.getMinutes() &&
    first.getSeconds() == second.getSeconds()
  );
}
