export function isEmpty(obj: any): boolean {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

export function isDomainEquals(first: string, second: string) {
  if (first === second) return true;
  else {
    var resultUrl = function (url: string) {
      if (url.indexOf('www.') > -1) return url.split('www.')[1];
      return url;
    };

    if (resultUrl(first) === resultUrl(second)) return true;
    else return false;
  }
}

export function getPercentage(time: number, totalTime: number) {
  return ((time / totalTime) * 100).toFixed(2);
}
