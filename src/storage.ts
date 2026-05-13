// =========================================
// STORAGE.TS - Generyczny Local Storage
// =========================================

// Generyczna klasa Storage - działa z dowolnym typem!
export class TypedStorage<T> {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    save(data: T): void {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
        } catch (error) {
            console.error(`Błąd zapisu do storage (${this.key}):`, error);
        }
    }

    load(): T | null {
        try {
            const item = localStorage.getItem(this.key);
            if (!item) return null;
            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`Błąd odczytu ze storage (${this.key}):`, error);
            return null;
        }
    }

    clear(): void {
        localStorage.removeItem(this.key);
    }

    exists(): boolean {
        return localStorage.getItem(this.key) !== null;
    }
}