export enum FileType {
  CSV = 'text/csv',
  JSON = 'application/json',
}

export function useFile(data: string, type: FileType, fileName: string) {
  const file = new Blob([data], { type: type });
  let downloadLink;
  downloadLink = document.createElement('a');
  downloadLink.download = fileName;
  downloadLink.href = window.URL.createObjectURL(file);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
}
