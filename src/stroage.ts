const DEFAULT_STORAGE = {
  /**
   * Indicates if the audio is muted
   */
  muted: false,
};

export type StroageData = typeof DEFAULT_STORAGE;

/**
 * The ID of the local storage where the data is stored.
 */
const STORAGE_ID = "fruit-spin";

export const storage = {
  /**
   * Initializes the storage data to the default if not already set.
   */
  readyStorage() {
    if (!localStorage.getItem(STORAGE_ID)) this.setStorage(DEFAULT_STORAGE);
  },

  /**
   * Retrieves the storage data.
   * @returns The storage data if it exists, undefined otherwise.
   */
  getStorage(): StroageData {
    const data = localStorage.getItem(STORAGE_ID);

    return data ? JSON.parse(data) : undefined;
  },

  /**
   * Sets the entire storage data.
   * @param data - The data to set.
   * @returns The set data.
   */
  setStorage(data: StroageData) {
    return localStorage.setItem(STORAGE_ID, JSON.stringify(data, undefined, 2));
  },
};
