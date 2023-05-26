import { getToday } from './today';

//Every day - 60 minutes * 24 hours
export const DAY_MINUTES = 1440;

export function getNextTimeOfDay(timeOfDay: number): number {
  const todaysTime = getToday() + timeOfDay;
  return todaysTime > Date.now() ? todaysTime : todaysTime + DAY_MINUTES;
}
