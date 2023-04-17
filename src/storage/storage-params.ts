export enum StorageParams {
    TABS = 'tabs',
    BLACK_LIST = 'black_list',
    RESTRICTION_LIST = 'restriction_list',
    NOTIFICATION_LIST = 'notification_list',
    NOTIFICATION_MESSAGE = 'notification_message',
    TIMEINTERVAL_LIST = 'time_interval',
    INTERVAL_INACTIVITY = 'inactivity_interval',
    INTERVAL_SAVE_STORAGE = 'interval_save_in_storage',
    INTERVAL_RANGE = 'range_days',
    DARK_MODE = 'night_mode',
    VIEW_TIME_IN_BADGE = 'view_time_in_badge',
    BLOCK_DEFERRAL = 'view_block_deferral',
    SHOW_HINT = 'show_hint',
}

export enum InactivityInterval {
    Seconds_30 = 30,
    Seconds_45 = 45,
    Min_1 = 60,
    Min_2 = 120,
    Min_5 = 300,
    Min_10 = 600,
    Min_20 = 1200,
    Min_30 = 1800
};

export enum RangeForDays {
    Days_2 = 'days2',
    Days_3 = 'days3',
    Days_4 = 'days4',
    Days_5 = 'days5',
    Days_6 = 'days6',
    Days_7 = 'days7',
    Month_1 = 'month1',
    Month_2 = 'month2',
    Month_3 = 'month3'
};

export const NOTIFICATION_MESSAGE_DEFAULT = 'You have spent a lot of time on this site';
export const INTERVAL_INACTIVITY_DEFAULT = InactivityInterval.Seconds_30;
export const INTERVAL_SAVE_STORAGE_DEFAULT = 5000;
export const INTERVAL_RANGE_DEFAULT = RangeForDays.Days_7;
export const DARK_MODE_DEFAULT = false;
export const VIEW_TIME_IN_BADGE_DEFAULT = true;
export const BLOCK_DEFERRAL_DEFAULT = true;
export const SHOW_HINT_DEFAULT = true;