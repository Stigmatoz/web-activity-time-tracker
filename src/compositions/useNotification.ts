import Browser from 'webextension-polyfill';
import { SECOND } from '../utils/time';

export enum NotificationType {
  DailySummaryNotification = 'daily-summary-notification',
  WebSiteNotification = 'website-notification',
}

export async function useNotification(
  notificationType: NotificationType,
  title: string,
  message: string,
): Promise<string> {
  await Browser.notifications.clear(notificationType);
  await new Promise(res => setTimeout(res, 3 * SECOND));
  return Browser.notifications.create(notificationType, {
    type: 'basic',
    title: title,
    message: message,
    iconUrl: Browser.runtime.getURL('128x128.png'),
    isClickable: false,
  });
}
