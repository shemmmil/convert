import dotenv from "dotenv";
import { TelegramBot } from "./telegram";

dotenv.config();

export const main = async () => {
  const telegramBot = new TelegramBot();
  telegramBot.start();
  telegramBot.sendSalaryMessage();
};
