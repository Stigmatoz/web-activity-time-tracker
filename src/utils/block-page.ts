export enum BlockParams {
  Domain = 'url',
  LimitTime = 'summaryTime',
  SummaryCounter = 'summaryCounter',
}

export function buildBlockQuery(url: string, liimitTime: number, summaryCounter: number) {
  return `?url=${url}&summaryTime=${liimitTime}&summaryCounter=${summaryCounter}`;
}

export function getValueFromQuery(url: string) {
  const urlObj = new URL(url);
  const domain = urlObj.searchParams.get(BlockParams.Domain);
  const limitTime = Number(urlObj.searchParams.get(BlockParams.LimitTime));
  const summaryCounter = Number(urlObj.searchParams.get(BlockParams.SummaryCounter));

  return {
    domain: domain,
    limitTime: limitTime,
    summaryCounter: summaryCounter,
  };
}
