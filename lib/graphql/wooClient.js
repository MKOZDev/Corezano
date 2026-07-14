const ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const SESSION_KEY = "cv-woo-session";

function getSessionToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

function setSessionToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, token);
}

export async function fetchWooGraphQL(query, variables = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getSessionToken();
  if (token) headers["woocommerce-session"] = `Session ${token}`;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const newSession = res.headers.get("woocommerce-session");
  if (newSession) setSessionToken(newSession);

  const json = await res.json();
  if (json.errors) {
    console.error("WooGraphQL errors:", json.errors);
    throw new Error(json.errors[0]?.message || "WooGraphQL request failed");
  }
  return json.data;
}
