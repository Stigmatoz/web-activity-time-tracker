import Browser from 'webextension-polyfill';

export async function getCurrentTab() {
  const tabs = await Browser.tabs.query({ active: true, currentWindow: true });
  // since only one tab should be active and in the current window at once
  // the return variable should only have one entry
  return tabs[0];
}
