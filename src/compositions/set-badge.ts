import Browser from "webextension-polyfill";

export interface BadgeState {
    color: BadgeColor;
    tabId: number;
    text: string;
}

export enum BadgeColor {
    red = '#fdb8b8',
    green = '#6ec05e',
    none = '#000'
}

export function useBadge(badge: BadgeState): void {
    Browser.action.setBadgeBackgroundColor({ color: badge.color })
    Browser.action.setBadgeText({
        tabId: badge.tabId,
        text: badge.text
    });
}