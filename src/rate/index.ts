import type { DailyRate } from "./type";

export const getDailyRate = async (): Promise<DailyRate> => {
  const response = await fetch("https://www.cbr-xml-daily.ru/latest.js");
  const data = await response.json();

  return data as DailyRate;
};
