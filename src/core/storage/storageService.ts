export interface StorageResult<T> {
  value: T;
  recovered: boolean;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readStorage<T>(
  storage: Storage | undefined,
  key: string,
  fallback: T,
): StorageResult<T> {
  if (!storage) {
    return { value: fallback, recovered: false };
  }

  const rawValue = storage.getItem(key);
  if (rawValue === null) {
    return { value: fallback, recovered: false };
  }

  try {
    return { value: JSON.parse(rawValue) as T, recovered: false };
  } catch {
    storage.removeItem(key);
    return { value: fallback, recovered: true };
  }
}

export const localStorageService = {
  get<T>(key: string, fallback: T): StorageResult<T> {
    return readStorage(isBrowser() ? window.localStorage : undefined, key, fallback);
  },
  set<T>(key: string, value: T): void {
    if (isBrowser()) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  },
  remove(key: string): void {
    if (isBrowser()) {
      window.localStorage.removeItem(key);
    }
  },
};

export const sessionStorageService = {
  get<T>(key: string, fallback: T): StorageResult<T> {
    return readStorage(isBrowser() ? window.sessionStorage : undefined, key, fallback);
  },
  set<T>(key: string, value: T): void {
    if (isBrowser()) {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  },
  remove(key: string): void {
    if (isBrowser()) {
      window.sessionStorage.removeItem(key);
    }
  },
};
