import { SettingsTab } from './enums';

export function getStringTab(tab: SettingsTab) {
  switch (tab) {
    case SettingsTab.Dashboard:
      return 'dashboard';
    case SettingsTab.WebsiteStats:
      return 'website-stats';
    case SettingsTab.GeneralSettings:
      return 'settings';
    case SettingsTab.About:
      return 'about';
    case SettingsTab.Limits:
      return 'limits';
    case SettingsTab.WhiteList:
      return 'whitelist';
    case SettingsTab.Notifications:
      return 'notifications';
    case SettingsTab.Pomodoro:
      return 'pomodoro';
  }
}

export function getEnumValueTab(tab: string) {
  switch (tab) {
    case 'dashboard':
      return SettingsTab.Dashboard;
    case 'website-stats':
      return SettingsTab.WebsiteStats;
    case 'settings':
      return SettingsTab.GeneralSettings;
    case 'about':
      return SettingsTab.About;
    case 'limits':
      return SettingsTab.Limits;
    case 'whitelist':
      return SettingsTab.WhiteList;
    case 'notifications':
      return SettingsTab.Notifications;
    case 'pomodoro':
      return SettingsTab.Pomodoro;
  }
}
