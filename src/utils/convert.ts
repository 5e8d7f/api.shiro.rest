export const moneyToCredits = (money: string) =>
  Math.floor(parseFloat(money) * 20);
