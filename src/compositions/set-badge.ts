import Browser from "webextension-polyfill";
import { BadgeState } from "./types";

export function useBadge(badge:BadgeState): void{
    Browser.action.setBadgeBackgroundColor({ color: badge.color })
    Browser.action.setBadgeText({
        tabId: badge.tabId,
        text: badge.text
    });
}