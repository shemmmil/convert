import { Telegraf, Context } from "telegraf";
import { getDailyRate } from "../rate";
import { Salary } from "../salary";
import { Update } from "telegraf/types";

const CHAT_ID = Number(process.env.CHAT_ID);
export class TelegramBot {
  private bot: Telegraf<Context<Update>>;
  private stranaSalary: number;
  private sensataSalary: number;

  constructor() {
    if (!process.env.BOT_TOKEN) {
      throw new Error("TELEGRAM_BOT_TOKEN must be provided!");
    }
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.stranaSalary = parseInt(process.env.SALARY ?? "0", 10);
    this.sensataSalary = parseInt(process.env.SENSATA_SALARY ?? "0", 10);
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
      const stranaSalary = new Salary(rates, this.stranaSalary);
      const currenciesRubTable = stranaSalary.getCurrenciesRubTable();

      const sensataSalary = new Salary(rates, this.sensataSalary);

      // Вычисляем суммы из обеих компаний
      const totalUsd =
        stranaSalary.getSalaryInUsdNumeric() +
        sensataSalary.getSalaryInUsdNumeric();
      const totalRub =
        stranaSalary.getSalaryInRubNumeric() +
        sensataSalary.getSalaryInRubNumeric();
      const stranaVAT = stranaSalary.getSalaryWithVATNumeric();
      const sensataVAT = sensataSalary.getSalaryWithVATNumeric();
      const totalCommission = stranaVAT[1] + sensataVAT[1];
      const totalWithVAT = stranaVAT[0] + sensataVAT[0];

      // Форматируем суммы
      const formattedTotalUsd = new Intl.NumberFormat("es-US", {
        style: "currency",
        currency: "USD",
      }).format(totalUsd);

      const formattedTotalRub = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(totalRub);

      const formattedTotalCommission = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(totalCommission);

      const formattedTotalWithVAT = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(totalWithVAT);

      const salaryTable = `
Курс: 1 ₽ - ${currenciesRubTable}

АС Выполнение:
USD: <span class="tg-spoiler">${stranaSalary.getSalaryInUsd()}</span>
RUB: <span class="tg-spoiler">${stranaSalary.getSalaryInRub()}</span>

Sensata:
USD: <span class="tg-spoiler">${sensataSalary.getSalaryInUsd()}</span>
RUB: <span class="tg-spoiler">${sensataSalary.getSalaryInRub()}</span>

USD: <span class="tg-spoiler">${formattedTotalUsd}</span>
RUB: <span class="tg-spoiler">${formattedTotalRub}</span>
Коммисия: <span class="tg-spoiler">${formattedTotalCommission}</span>
Итого: <span class="tg-spoiler">${formattedTotalWithVAT}</span>
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
