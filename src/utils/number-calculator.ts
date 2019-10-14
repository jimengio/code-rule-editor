import { Decimal } from "decimal.js";

export function decimalSum(...args: number[]): number {
  let sum: number = 0;
  args.forEach((num) => {
    sum = Decimal.add(sum, num || 0).toNumber();
  });

  return sum;
}

export function decimalMinus(x: number, y: number): number {
  return new Decimal(x || 0).minus(y || 0).toNumber();
}
