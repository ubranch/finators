import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAmount(
  amount: string,
  format: string = "default"
): string {
  const num = Number(amount)
  if (isNaN(num)) {
    return amount
  }

  if (format === "thousands") {
    return (num / 1000).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    }) + "k"
  }

  if (format === "millions") {
    return (num / 1000000).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    }) + "M"
  }

  return num.toLocaleString("en-US")
}
