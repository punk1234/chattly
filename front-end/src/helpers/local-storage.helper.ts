/**
 * @class LocalStorage
 */
export class LocalStorage {
  static readonly AUTH_TOKEN_KEY = "auth_token";
  static readonly USER_DATA_KEY = "user_data";

  /**
   * @method save
   * @instance
   * @param {string} key
   * @param {*} value
   */
  save(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * @method get
   * @instance
   * @param {string} key
   * @returns {*}
   */
  get(key: string): any {
    const VALUE = localStorage.getItem(key);

    if (VALUE) {
      return JSON.parse(VALUE);
    }

    return VALUE;
  }
}

export const appStorage = new LocalStorage();
