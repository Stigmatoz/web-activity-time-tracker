import Browser from 'webextension-polyfill';

// Uses the browser's local favicon cache (needs the "favicon" permission); no network request is made.
export function getFavicon(urlOrDomain: string | undefined) {
  if (!urlOrDomain) return '';
  const pageUrl = /^https?:\/\//.test(urlOrDomain) ? urlOrDomain : `https://${urlOrDomain}`;
  return `${Browser.runtime.getURL('/_favicon/')}?pageUrl=${encodeURIComponent(pageUrl)}&size=64`;
}
