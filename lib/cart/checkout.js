export function redirectToCheckout(items) {
  const payload = items.map((item) => ({
    id: item.id,
    qty: item.quantity,
    ...(item.variationId ? { vid: item.variationId } : {}),
    ...(item.attributes ? { attrs: item.attributes } : {}),
  }));

  const encoded = encodeURIComponent(JSON.stringify(payload));
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL.replace(
    /\/graphql\/?$/,
    "",
  );
  const checkoutTriggerUrl = `${baseUrl}/?add_items=${encoded}`;

  window.location.href = checkoutTriggerUrl;
}
