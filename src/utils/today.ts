import startOfToday from 'date-fns/startOfToday';

export function todayLocalDate() {
  return new Date().toLocaleDateString('en-US');
}

export function getToday(): number {
  return startOfToday().getTime();
}
