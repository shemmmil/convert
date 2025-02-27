import { Telegraf, Context } from "telegraf";
import { getDailyRate } from "../rate";
import { Salary } from "../salary";
import { Update } from "telegraf/types";

const CHAT_ID = Number(process.env.CHAT_ID);
export class TelegramBot {
  private bot: Telegraf<Context<Update>>;

  constructor() {
    if (!process.env.BOT_TOKEN) {
      throw new Error("TELEGRAM_BOT_TOKEN must be provided!");
    }
    this.bot = new Telegraf(process.env.BOT_TOKEN);
  }

  async start() {
    try {
      await this.bot.launch();
      console.log("Bot has been started");
    } catch (error) {
      console.error("Error starting the bot:", error);
    }
  }

  async sendSalaryMessage() {
    try {
      const rates = await getDailyRate();
      const salary = new Salary(rates);
      const currenciesRubTable = salary.getCurrenciesRubTable();

      const salaryTable = `
Курс: 1 руб - ${currenciesRubTable}
USD: <span class="tg-spoiler">${salary.getSalaryInUsd()}</span>
RUB: <span class="tg-spoiler">${salary.getSalaryInRub()}</span>
Коммисия: <span class="tg-spoiler">${salary.getSalaryWithVAT()[1]}</span>

Итого: <span class="tg-spoiler">${salary.getSalaryWithVAT()[0]}</span>
      `;

      await this.bot.telegram.sendMessage(CHAT_ID, salaryTable, {
        parse_mode: "HTML",
      });
      console.log("Salary message sent successfully");
    } catch (error) {
      console.error("Error sending salary message:", error);
    } finally {
      process.exit();
    }
  }
}
