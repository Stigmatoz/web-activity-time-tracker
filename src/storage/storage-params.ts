import { Tab } from '../entity/tab';
import { TimeInterval } from '../entity/time-interval';
import { HOUR } from '../utils/time';

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
  }
}
