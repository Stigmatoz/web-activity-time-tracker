export function applyDarkMode(value: boolean): void {
  value ? document.body.classList.add('dark') : document.body.classList.remove('dark');
}
