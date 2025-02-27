import fx from "money";

import { DailyRate } from "../rate/type";

export class Salary {
  private salarayInTenge: number = parseInt(process.env.SALARY ?? "0", 10);

  constructor(rate: DailyRate) {
    fx.base = rate.base;
    fx.rates = rate.rates;
  }

  getSalaryInRub() {
    const amoutSalaryInRub = fx(this.salarayInTenge).from("KZT").to("RUB");

    const formatingRub = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(amoutSalaryInRub);

    return formatingRub;
  }

  getSalaryInUsd() {
    const amoutSalaryInUsd = fx(this.salarayInTenge).from("KZT").to("USD");

    const formatingUsd = new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
    }).format(amoutSalaryInUsd);

    return formatingUsd;
  }

  getCurrenciesRubTable() {
    return new Intl.NumberFormat("ru-KZ", {
      style: "currency",
      currency: "KZT",
    }).format(fx(1).from("RUB").to("KZT"));
  }

  getSalaryWithVAT() {
    const currentRate = Number(
      this.salarayInTenge / fx(this.salarayInTenge).from("KZT").to("RUB")
    ).toFixed(2);

    const vat = parseFloat(process.env.VAT ?? "0");
    const rateWithVat = Number(currentRate) + vat;
    const salaryWithVat = this.salarayInTenge / rateWithVat;

    const amoutSalaryInRub = fx(this.salarayInTenge).from("KZT").to("RUB");

    const vatSum = amoutSalaryInRub - salaryWithVat;

    return [
      new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(salaryWithVat),
      new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(vatSum),
    ];
  }
}
