export default function Price({
  amount,
  currencyCode = "KES",
}: {
  amount: string | number
  currencyCode: string
}) {
  const formatPrice = (value: string | number) => {
    const numericPrice = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    })
      .format(numericPrice)
      .replace("KES", "Ksh")
  }

  return <p>{formatPrice(amount)}</p>
}

