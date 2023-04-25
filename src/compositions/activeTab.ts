export class ActiveTab {
  private static instance: ActiveTab;
  private _activeTab: string | null;

  constructor() {
      if (ActiveTab.instance) {
          throw new Error("Error - use ActiveTab.getInstance()");
      }
      this._activeTab = null;
  }

  static getInstance(): ActiveTab {
    ActiveTab.instance = ActiveTab.instance || new ActiveTab();
    return ActiveTab.instance;
  }

  public setActiveTab(value:string | null): void
  {
    this._activeTab = value;
  }

  public getActiveTab(): string | null
  {
    return this._activeTab;
  }
}