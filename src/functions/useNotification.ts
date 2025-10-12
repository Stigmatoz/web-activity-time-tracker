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
  // Check if we have notification permissions
  const hasPermission = await checkNotificationPermission();
  console.log('[useNotification] Permission check result:', hasPermission);
  
  if (!hasPermission) {
    console.warn('[useNotification] Notification permission not granted');
    return '';
  }

  await Browser.notifications.clear(notificationType);
  console.log('[useNotification] Cleared existing notifications');
  
  await new Promise(res => setTimeout(res, 3 * SECOND));
  
  const notificationOptions = {
    type: 'basic',
    title: title,
    message: message,
    iconUrl: Browser.runtime.getURL('128x128.png'),
    isClickable: true, // Make it clickable so it's more visible
    requireInteraction: true, // Keep it visible until user interacts
  };
  
  console.log('[useNotification] Creating notification with options:', notificationOptions);
  
  try {
    const notificationId = await Browser.notifications.create(notificationType, notificationOptions);
    console.log('[useNotification] Notification created successfully with ID:', notificationId);
    
    // Add event listeners to track notification events
    Browser.notifications.onShown?.addListener((id) => {
      if (id === notificationId) {
        console.log('[useNotification] Notification shown:', id);
      }
    });
    
    Browser.notifications.onClosed?.addListener((id, byUser) => {
      if (id === notificationId) {
        console.log('[useNotification] Notification closed:', id, 'by user:', byUser);
      }
    });
    
    return notificationId;
  } catch (error) {
    console.error('[useNotification] Error creating notification:', error);
    return '';
  }
}

export async function checkNotificationPermission(): Promise<boolean> {
  try {
    // Check if we have the notifications permission
    const permission = await Browser.permissions.contains({ permissions: ['notifications'] });
    console.log('[checkNotificationPermission] Extension has notifications permission:', permission);
    
    // Also check if the browser allows notifications at all
    if (typeof Notification !== 'undefined') {
      console.log('[checkNotificationPermission] Browser Notification API available');
      console.log('[checkNotificationPermission] Browser notification permission:', Notification.permission);
      
      // If browser permission is 'default', request it
      if (Notification.permission === 'default') {
        console.log('[checkNotificationPermission] Requesting browser notification permission...');
        const browserPermission = await Notification.requestPermission();
        console.log('[checkNotificationPermission] Browser permission result:', browserPermission);
      }
    } else {
      console.warn('[checkNotificationPermission] Browser Notification API not available');
    }
    
    return permission;
  } catch (error) {
    console.error('[checkNotificationPermission] Error checking notification permission:', error);
    return false;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const granted = await Browser.permissions.request({ permissions: ['notifications'] });
    return granted;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}
