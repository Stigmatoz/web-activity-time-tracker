import { getToday } from './date';

export type Time = {
  hours: number;
  minutes: number;
};

export const MINUTE_IN_SECONDS = 60;
export const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;

//Every day - 60 minutes * 24 hours
export const DAY_MINUTES = 1440;
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

export function getNextTimeOfDay(timeOfDay: number): number {
  const todaysTime = getToday() + timeOfDay;
  return todaysTime > Date.now() ? todaysTime : todaysTime + DAY_MINUTES;
}

export function treatAsUTC(date: Date): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

export function daysBetween(startDate: Date, endDate: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (treatAsUTC(endDate).valueOf() - treatAsUTC(startDate).valueOf()) / millisecondsPerDay + 1;
}
