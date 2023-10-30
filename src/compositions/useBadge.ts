import Browser from 'webextension-polyfill';

export interface BadgeState {
  color: BadgeColor;
  tabId: number | undefined;
  text: string;
}

export enum BadgeColor {
  red = '#fdb8b8',
  green = '#6ec05e',
  blue = '#1a73e8',
  none = '#000',
}

export async function useBadge(badge: BadgeState): Promise<void> {
  if (badge.tabId != undefined) {
    await Browser.action.setBadgeBackgroundColor({ color: badge.color });
    await Browser.action.setBadgeText({
      tabId: badge.tabId,
      text: badge.text,
    });
  }
}
