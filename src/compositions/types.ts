export interface BadgeState {
    color: BadgeColor;
    tabId: number;
    text: string;
}

export enum BadgeColor {
    red = '#fdb8b8',
    green = '#6ec05e',
    none = '#000'
}