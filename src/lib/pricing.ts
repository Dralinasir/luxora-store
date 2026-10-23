
export function calculateLineTotal(
  unitPriceMinor: number,
  quantity: number
): number {
  if (
    !Number.isSafeInteger(unitPriceMinor) ||
    unitPriceMinor < 0 ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1
  ) {
    throw new Error("Invalid price or quantity");
  }

  const total = unitPriceMinor * quantity;

  if (!Number.isSafeInteger(total)) {
    throw new Error("Line total exceeds supported range");
  }

  return total;
}

export function calculateShipping(
  subtotalMinor: number,
  freeShippingAtMinor: number | null,
  flatFeeMinor: number
): number {
  if (
    !Number.isSafeInteger(subtotalMinor) ||
    subtotalMinor < 0 ||
    !Number.isSafeInteger(flatFeeMinor) ||
    flatFeeMinor < 0
  ) {
    throw new Error("Invalid shipping input");
  }

  if (
    freeShippingAtMinor !== null &&
    (!Number.isSafeInteger(freeShippingAtMinor) ||
      freeShippingAtMinor < 0)
  ) {
    throw new Error("Invalid free-shipping threshold");
  }

  return freeShippingAtMinor !== null &&
    subtotalMinor >= freeShippingAtMinor
    ? 0
    : flatFeeMinor;
}
