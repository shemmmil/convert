import { writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";

const STORAGE_PATH = "../../data/users.json";

export interface UserData {
  chatId: number;
  salary: number;
  vat?: number;
}

export class Storage {
  private data: Map<number, UserData> = new Map();

  async init() {
    try {
      if (existsSync(STORAGE_PATH)) {
        const fileData = await readFile(STORAGE_PATH, "utf-8");
        const users = JSON.parse(fileData);
        this.data = new Map(
          Object.entries(users).map(([key, value]) => [
            Number(key),
            value as UserData,
          ])
        );
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  async save() {
    try {
      const jsonData = Object.fromEntries(this.data);
      await writeFile(STORAGE_PATH, JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }

  getUser(chatId: number): UserData | undefined {
    return this.data.get(chatId);
  }

  setUser(chatId: number, salary: number) {
    this.data.set(chatId, { chatId, salary });
    this.save();
  }
}
