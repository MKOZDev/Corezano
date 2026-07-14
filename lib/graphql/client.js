const WP_GRAPHQL_ENDPOINT = process.env.WORDPRESS_API_URL;

export async function fetchGraphQL(query, variables = {}) {
  if (!WP_GRAPHQL_ENDPOINT) {
    throw new Error("Brak WORDPRESS_API_URL w .env.local");
  }

  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  const json = await res.json();

  if (json.errors) {
    console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));
    throw new Error("GraphQL query failed");
  }

  return json.data;
}
