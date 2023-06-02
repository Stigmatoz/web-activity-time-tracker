import { getToday } from './today';

//Every day - 60 minutes * 24 hours
export const DAY_MINUTES = 1440;

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
