class LocalStorageService {
    static get(key) {
        const item = localStorage.getItem(key);
        if (!item) return null;

        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    }


    static set(key, value) {
        const serialized = typeof value === 'string'
            ? value
            : JSON.stringify(value);
        localStorage.setItem(key, serialized);
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }

    static has(key) {
        return localStorage.getItem(key) !== null;
    }
}

export { LocalStorageService }