import Browser from 'webextension-polyfill';

export async function createOffscreen() {
  const path = 'src/offscreen.html';
  const offscreenUrl = Browser.runtime.getURL(path);
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: offscreenUrl,
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Play audio sounds',
  });
}
