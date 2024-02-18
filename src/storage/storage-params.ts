import { Tab } from '../entity/tab';
import { TimeInterval } from '../entity/time-interval';
import { PomodoroSounds } from '../utils/pomodoro';
import { HOUR, MINUTE_IN_SECONDS } from '../utils/time';

export enum StorageParams {
  BLACK_LIST = 'black_list',
  RESTRICTION_LIST = 'restriction_list',
  NOTIFICATION_LIST = 'notification_list',
  NOTIFICATION_MESSAGE = 'notification_message',
  INTERVAL_INACTIVITY = 'inactivity_interval',
  DARK_MODE = 'night_mode',
  VIEW_TIME_IN_BADGE = 'view_time_in_badge',
  SHOW_CHANGELOG = 'show_changelog',
  BLOCK_DEFERRAL = 'view_block_deferral',
  BLOCK_DEFERRAL_TIME = 'view_block_deferral_time',
  DAILY_SUMMARY_NOTIFICATION_TIME = 'daily-summary-notification-time',
  DAILY_NOTIFICATION = 'daily_notification',
  REVIEW_DATE = 'review_date',
  REVIEW_PROMPT_AT = 'review_prompt_at',
  INSTALL_DATE = 'install-date',
  PROMO_CLEAR_YOUTUBE_ON_LIMITS = 'promo-clear-youtube-on-limits',
  PROMO_CLEAR_YOUTUBE_ON_BLOCK = 'promo-clear-youtube-on-block',
  IS_POMODORO_ENABLED = 'is-pomodoro-enabled',
  POMODORO_START_TIME = 'pomodoro-start-time',
  POMODORO_INTERVAL_WORK = 'pomodoro-interval-work',
  POMODORO_AUDIO_AFTER_WORK = 'pomodoro-audio-after-work',
  POMODORO_AUDIO_AFTER_REST = 'pomodoro-audio-after-rest',
  POMODORO_AUDIO_AFTER_FINISHED = 'pomodoro-audio-after-finished',
  POMODORO_INTERVAL_REST = 'pomodoro-interval-rest',
  POMODORO_FREQUENCY = 'pomodoro-frequency',
}

export enum StorageDeserializeParam {
  TABS = 'tabs',
  TIMEINTERVAL_LIST = 'time_interval',
}

export function createDeserializeParambject(
  param: StorageDeserializeParam,
): StorageDeserializeType {
  switch (param) {
    case StorageDeserializeParam.TABS:
      return new Tab();
    case StorageDeserializeParam.TIMEINTERVAL_LIST:
      return new TimeInterval();
  }
}

export type StorageDeserializeType = Tab | TimeInterval;

export enum InactivityInterval {
  Seconds_30 = 30,
  Seconds_45 = 45,
  Min_1 = 60,
  Min_2 = 120,
  Min_5 = 300,
  Min_10 = 600,
  Min_20 = 1200,
  Min_30 = 1800,
}

export const NOTIFICATION_MESSAGE_DEFAULT = 'You have spent a lot of time on this site';
export const INTERVAL_INACTIVITY_DEFAULT = InactivityInterval.Seconds_30;
export const INTERVAL_SAVE_STORAGE_DEFAULT = 5000;
export const DARK_MODE_DEFAULT = false;
export const VIEW_TIME_IN_BADGE_DEFAULT = true;
export const BLOCK_DEFERRAL_DEFAULT = true;
export const SHOW_HINT_DEFAULT = true;
// default time is 20:00, time in seconds
export const DAILY_SUMMARY_NOTIFICATION_TIME_DEFAULT = (20 * HOUR) / 1000;
export const DAILY_NOTIFICATION_DEFAULT = true;
export const SHOW_CHANGELOG_DEFAULT = false;
export const SHOW_PROMO_CLEAR_YOUTUBE_DEFAULT = false;
export const IS_POMODORO_ENABLED_DEFAULT = false;
export const POMODORO_INTERVAL_WORK_DEFAULT = 25 * MINUTE_IN_SECONDS;
export const POMODORO_INTERVAL_REST_DEFAULT = 5 * MINUTE_IN_SECONDS;
export const POMODORO_FREQUENCY_DEFAULT = 3;
export const POMODORO_AUDIO_AFTER_WORK_DEFAULT = PomodoroSounds['Sound 3'];
export const POMODORO_AUDIO_AFTER_REST_DEFAULT = PomodoroSounds['Sound 8'];
export const POMODORO_AUDIO_AFTER_FINISHED_DEFAULT = PomodoroSounds['Sound 10'];

export function getDefaultValue(param: StorageParams) {
  switch (param) {
    case StorageParams.BLACK_LIST:
      return [];
    case StorageParams.RESTRICTION_LIST:
      return [];
    case StorageParams.NOTIFICATION_LIST:
      return [];
    case StorageParams.NOTIFICATION_MESSAGE:
      return NOTIFICATION_MESSAGE_DEFAULT;
    case StorageParams.INTERVAL_INACTIVITY:
      return INTERVAL_INACTIVITY_DEFAULT;
    case StorageParams.DARK_MODE:
      return DARK_MODE_DEFAULT;
    case StorageParams.VIEW_TIME_IN_BADGE:
      return VIEW_TIME_IN_BADGE_DEFAULT;
    case StorageParams.BLOCK_DEFERRAL:
      return BLOCK_DEFERRAL_DEFAULT;
    case StorageParams.BLOCK_DEFERRAL_TIME:
      return [];
    case StorageParams.DAILY_SUMMARY_NOTIFICATION_TIME:
      return DAILY_SUMMARY_NOTIFICATION_TIME_DEFAULT;
    case StorageParams.DAILY_NOTIFICATION:
      return DAILY_NOTIFICATION_DEFAULT;
    case StorageParams.SHOW_CHANGELOG:
      return SHOW_CHANGELOG_DEFAULT;
    case StorageParams.PROMO_CLEAR_YOUTUBE_ON_BLOCK:
    case StorageParams.PROMO_CLEAR_YOUTUBE_ON_LIMITS:
      return SHOW_PROMO_CLEAR_YOUTUBE_DEFAULT;
    case StorageParams.IS_POMODORO_ENABLED:
      return IS_POMODORO_ENABLED_DEFAULT;
    case StorageParams.POMODORO_INTERVAL_WORK:
      return POMODORO_INTERVAL_WORK_DEFAULT;
    case StorageParams.POMODORO_INTERVAL_REST:
      return POMODORO_INTERVAL_REST_DEFAULT;
    case StorageParams.POMODORO_FREQUENCY:
      return POMODORO_FREQUENCY_DEFAULT;
    case StorageParams.POMODORO_AUDIO_AFTER_WORK:
      return POMODORO_AUDIO_AFTER_WORK_DEFAULT;
    case StorageParams.POMODORO_AUDIO_AFTER_REST:
      return POMODORO_AUDIO_AFTER_REST_DEFAULT;
    case StorageParams.POMODORO_AUDIO_AFTER_FINISHED:
      return POMODORO_AUDIO_AFTER_FINISHED_DEFAULT;
  }
}
