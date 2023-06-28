export enum BlockParams {
  Domain = 'domain',
  URL = 'url',
  LimitTime = 'summaryTime',
  SummaryCounter = 'summaryCounter',
}

export function buildBlockQuery(
  domain: string,
  url: string,
  liimitTime: number,
  summaryCounter: number,
) {
  return `?domain=${domain}&url=${url}&summaryTime=${liimitTime}&summaryCounter=${summaryCounter}`;
}

export function getValueFromQuery(url: string) {
  const urlObj = new URL(url);
  const domain = urlObj.searchParams.get(BlockParams.Domain);
  const sourceUrl = urlObj.searchParams.get(BlockParams.URL);
  const limitTime = Number(urlObj.searchParams.get(BlockParams.LimitTime));
  const summaryCounter = Number(urlObj.searchParams.get(BlockParams.SummaryCounter));

  return {
    domain: domain,
    url: sourceUrl,
    limitTime: limitTime,
    summaryCounter: summaryCounter,
  };
}
