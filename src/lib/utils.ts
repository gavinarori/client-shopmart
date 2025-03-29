import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createUrl(pathname: string, params: URLSearchParams) {
  const paramsString = params.toString()
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`

  return `${pathname}${queryString}`
}

export function formatPrice(
  price: number,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT" | "KES"
    notation?: Intl.NumberFormatOptions["notation"]
  } = {},
) {
  const { currency = "KES", notation = "standard" } = options

  const formatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    notation,
    currencyDisplay: "symbol",
  })

  return formatter.format(price).replace("KES", "Ksh")
}