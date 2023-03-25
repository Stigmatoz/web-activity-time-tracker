export interface BadgeState {
    color: BadgeColor;
    tabId: number;
    text: string;
}

export enum BadgeColor {
    red = '#fdb8b8',
    green = '#e7e7e7',
    none = '#000'
}