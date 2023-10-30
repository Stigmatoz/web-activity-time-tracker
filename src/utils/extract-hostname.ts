export function extractHostname(url: string | undefined): string {
  let hostname;
  if (url == undefined) return '';

  if (url.startsWith('file:')) {
    return url;
  }

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
}
