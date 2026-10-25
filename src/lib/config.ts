
export const storeConfig = {
  name: "LUXORA",
  currency: "PKR",
  locale: "en-PK",
  supportEmail:
    process.env.EMAIL_FROM_ADDRESS || "support@example.com",
};

export function formatPKR(amount: number): string {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new Error("Invalid monetary amount");
  }

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}
