import Browser from 'webextension-polyfill';

export interface BadgeState {
  text: string;
  color: BadgeColor;
  tabId?: number;
  icon?: BadgeIcon;
}

export enum BadgeIcon {
  default = '/assets/icons/128x128.png',
  pomodoroWorkingTime = '/assets/icons/pomodoro.png',
  pomodoroRestTime = '/assets/icons/pomodoro-rest-icon.png',
}

export enum BadgeColor {
  red = '#fdb8b8',
  green = '#6ec05e',
  blue = '#1a73e8',
  none = '#000',
}

export async function useBadge(badge: BadgeState): Promise<void> {
  await Browser.action.setBadgeBackgroundColor({ color: badge.color });
  await Browser.action.setBadgeText({
    tabId: badge.tabId,
    text: badge.text,
  });
  if (badge.icon) {
    await Browser.action.setIcon({
      path: badge.icon,
    });
    await Browser.action.setBadgeText({
      text: badge.text,
    });
  } else
    await Browser.action.setIcon({
      path: BadgeIcon.default,
    });
}
