const cron = require("node-cron");
const fx = require("money");
const { table, getBorderCharacters } = require("table");

const rates = require("./rates.json");

fx.base = rates.base;

fx.rates = rates.rates;

const SALARY_IN_TENGE = 900_000;

const amoutSalaryInRub = fx(SALARY_IN_TENGE).from("KZT").to("RUB");
const amoutSalaryInUsd = fx(SALARY_IN_TENGE).from("KZT").to("USD");

const formatingRub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
}).format(amoutSalaryInRub);

const formatingUsd = new Intl.NumberFormat("es-US", {
  style: "currency",
  currency: "USD",
}).format(amoutSalaryInUsd);

const { Telegraf, Format } = require("telegraf");

const bot = new Telegraf("5991422371:AAG2V4jkVvv_8VL_hAWnGCWL_uCJLlNFjss");

bot.launch();

bot.command("start", (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Hello there! Welcome to the Code Capsules telegram bot.\nI respond to /ethereum. Please try it",
    {}
  );
});

const salariesTable = [
  ["Зарплата", "в рублях", "в долларах"],
  [
    new Intl.NumberFormat("ru-KZ", {
      style: "currency",
      currency: "KZT",
    }).format(SALARY_IN_TENGE),
    formatingRub,
    formatingUsd,
  ],
];

const config = {
  border: getBorderCharacters("ramac"),
};
const result = table(salariesTable, config);
const format = Format.code(result);

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  const oneDollarToTenge = fx(1).from("USD").to("KZT");
  const oneDollarToRub = fx(1).from("USD").to("RUB");

  const formatingRub = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(oneDollarToRub);

  const formatingKzt = new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
  }).format(oneDollarToTenge);

  const currenciesRubTable = [
    ["Рубль", "Тенге"],
    [
      new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(1),
      new Intl.NumberFormat("ru-KZ", {
        style: "currency",
        currency: "KZT",
      }).format(fx(1).from("RUB").to("KZT")),
    ],
  ];

  const currenciesTable = [
    ["Доллар США", "рублей", "тенге"],
    [
      new Intl.NumberFormat("es-US", {
        style: "currency",
        currency: "USD",
      }).format(1),
      formatingRub,
      formatingKzt,
    ],
  ];

  bot.telegram.sendMessage(
    chatId,
    Format.code([
      table(currenciesRubTable, config),
      table(currenciesTable, config),
      format,
    ])
  );
  bot.telegram.sendMessage(chatId, Format.fmt(table(currenciesRubTable)));
  bot.telegram.sendMessage(chatId, format, { parse_mode: "MarkdownV2" });
});

cron.schedule("* * * * * *", () => {
  // const chatId = 238923775; // Replace with the actual chat ID
  console.log("Hello ", tengeToRub);
  // bot.telegram.sendMessage(chatId, tengeToRub);
});
