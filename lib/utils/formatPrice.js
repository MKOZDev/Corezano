export function decodeHtmlEntities(str) {
  if (!str) return "";
  return str.replace(/&nbsp;/g, "").replace(/&amp;/g, "&");
}

export function parsePriceToNumber(str) {
  if (!str) return 0;
  const cleaned = decodeHtmlEntities(str)
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3},)/g, "")
    .replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
