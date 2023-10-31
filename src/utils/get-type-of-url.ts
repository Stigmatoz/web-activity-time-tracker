import { TypeOfUrl } from './enums';

export function getTypeOfUrl(url: string) {
  return url.startsWith('file:') ? TypeOfUrl.Document : TypeOfUrl.WebSite;
}
