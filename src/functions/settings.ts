import { injectStorage } from '../storage/inject-storage';
import { StorageParams, getDefaultValue } from '../storage/storage-params';

export class Settings {
  private static instance: Settings;
  private _settings = new Map();

  constructor() {
    if (Settings.instance) {
      throw new Error('Error - use Settings.getInstance()');
    }
  }

  static getInstance(): Settings {
    Settings.instance = Settings.instance || new Settings();
    return Settings.instance;
  }

  async getSetting(param: StorageParams) {
    if (this._settings.has(param)) return this._settings.get(param);
    else return await this.getValue(param);
  }

  async reloadSetting(param: StorageParams) {
    await this.getValue(param);
  }

  private async getValue(param: StorageParams) {
    const storage = injectStorage();
    const value = await storage.getValue(param, getDefaultValue(param));
    this._settings.set(param, value);
    return value;
  }
}
