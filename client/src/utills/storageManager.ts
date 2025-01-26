
import CryptoJS from 'crypto-js';

// Define allowed types for storage
const types = ['PERSIST', 'OTHERS', 'SESSION', 'AUTH'] as const;

// Define a type for allowed storage types
type StorageType = typeof types[number];

export class StorageManager {
    private name: string;
    private type: StorageType;
    private secure: boolean;
    private value: string | null;
    private secretKey: string;

    constructor(name: string, type: StorageType, secure: boolean = false, value: string | null = null) {
        if (!types.includes(type)) {
            throw new Error(`Invalid type. Allowed types are: ${types.join(', ')}`);
        }
        this.name = name;
        this.type = type;
        this.secure = secure;
        this.value = value;
        this.secretKey = 'jasbdu$H@H#()*&663';
    }

    // Format the key using name and type
    private formatGenerator(): string {
        return `${this.type}$$_${this.name}`;
    }

    // Encrypt the value if secure, else return plain
    private encryptValue(value: string | null): string | null {
        if (value === null) return null;
        return this.secure ? CryptoJS.AES.encrypt(value, this.secretKey).toString() : value;
    }

    // Decrypt the value if secure, else return plain
    private decryptValue(value: string | null): string | null {
        if (value === null) return null;
        if (this.secure) {
            const bytes = CryptoJS.AES.decrypt(value, this.secretKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        }
        return value;
    }

    // Set value in local storage with optional encryption
    public setStorage(): void {
        const formattedKey = this.formatGenerator();
        const storageValue = this.encryptValue(this.value);
        localStorage.setItem(formattedKey, JSON.stringify(storageValue));
    }

    // Get value from local storage with optional decryption
    public getStorage(): string | null {
        const formattedKey = this.formatGenerator();
        const storedValue = localStorage.getItem(formattedKey);
        if (storedValue) {
            try {
                const parsedValue = JSON.parse(storedValue) as string | null;
                return this.decryptValue(parsedValue);
            } catch (error) {
                console.error('Failed to parse stored value:', error);
                return null;
            }
        }
        return null;
    }

    // Delete item from local storage
    public deleteStorage(): void {
        const formattedKey = this.formatGenerator();
        localStorage.removeItem(formattedKey);
    }

    // Remove all local storage items except those with 'PERSIST' type
    public static clearNonPersistent(): void {
        Object.keys(localStorage).forEach((key) => {
            if (!key.startsWith('PERSIST$$_')) {
                localStorage.removeItem(key);
            }
        });
    }
}