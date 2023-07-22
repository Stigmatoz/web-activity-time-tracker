import i18n, { getMessagesFromLocale } from '../plugins/i18n';
import { HOUR, MINUTE, Time } from './time';

export function convertHHMMToSeconds(hours: number, minutes: number) {
  return hours * 3600 + minutes * 60;
}

export function convertHHMMToMilliSeconds(hours: number, minutes: number) {
  return hours * HOUR + minutes * MINUTE;
}

export function convertSecondsToHHMM(seconds: number): Time {
  const hours = Math.floor(seconds / 3600);
  const totalSeconds = seconds % 3600;
  const mins = Math.floor(totalSeconds / 60);

  return {
    hours: hours,
    minutes: mins,
  };
}

export function convertMilliSecondsToHHMM(seconds: number): Time {
  const hours = Math.floor(seconds / HOUR);
  const totalSeconds = seconds % HOUR;
  const mins = Math.floor(totalSeconds / MINUTE);

  return {
    hours: hours,
    minutes: mins,
  };
}

export function convertSummaryTimeToBadgeString(summaryTime: number): string {
  const sec = summaryTime;
  const min = Number((summaryTime / 60).toFixed(0));
  const hours = Number((summaryTime / (60 * 60)).toFixed(1));

  if (sec < 60) return `${sec}s`;
  else if (min < 60) return `${min}m`;
  else return `${hours}h`;
}

export function convertSummaryTimeToString(summaryTime: number) {
  let days = Math.floor(summaryTime / 3600 / 24);
  const totalHours = summaryTime % (3600 * 24);
  let hours = Math.floor(totalHours / 3600);
  const totalSeconds = summaryTime % 3600;
  let mins = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  function appendTime(value: number, stringPrefix: string, isUseZero: boolean = false) {
    return value > 0 ? `${isUseZero ? zeroAppend(value) : value} ${stringPrefix}` : '';
  }

  const daysStr = appendTime(days, i18n.global.t('d.message'));
  const hoursStr = appendTime(hours, i18n.global.t('h.message'), daysStr == '' ? false : true);
  const minsStr = appendTime(mins, i18n.global.t('m.message'), hoursStr == '' ? false : true);
  const secondsStr = appendTime(seconds, i18n.global.t('s.message'), minsStr == '' ? false : true);

  return `${daysStr} ${hoursStr} ${minsStr} ${secondsStr}`;
}

export function convertLimitTimeToString(summaryTime: number) {
  const totalHours = summaryTime % (3600 * 24);
  let hours = Math.floor(totalHours / 3600);
  const totalSeconds = summaryTime % 3600;
  let mins = Math.floor(totalSeconds / 60);

  function appendTime(value: number, stringPrefix: string, isUseZero: boolean = false) {
    return `${isUseZero ? zeroAppend(value) : value} ${stringPrefix}`;
  }

  return `${appendTime(hours, getMessagesFromLocale()['h']['message'])} ${appendTime(
    mins,
    getMessagesFromLocale()['m']['message'],
    true,
  )}`;
}

function zeroAppend(time: number) {
  if (time < 10) return `0${time}`;
  else return time;
}
