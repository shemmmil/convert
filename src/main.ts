import { TelegramBot } from "./telegram";

export const main = async () => {
  const telegramBot = new TelegramBot();
  telegramBot.start();
  telegramBot.sendSalaryMessage();
};
