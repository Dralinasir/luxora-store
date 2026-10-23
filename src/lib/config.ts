
export const storeConfig = {
  name: "LUXORA",
  currency: "PKR",
  locale: "en-PK",
  supportEmail:
    process.env.EMAIL_FROM_ADDRESS || "support@example.com"
};

export function formatPKR(amountMinor: number): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) {
    throw new Error("Invalid monetary amount");
  }

  // Database monetary values are stored in paisa.
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2
  }).format(amountMinor / 100);
}
