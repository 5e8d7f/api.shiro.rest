export const codeRegex = /SHIRO-[A-Z0-9]{8}-REST/;

export const moneyToCredits = (money: string) =>
  Math.floor(parseFloat(money) * 20);
