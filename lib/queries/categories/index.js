export const GET_CATEGORIES = `
  query GetCategories($language: String!) {
    productCategories(first: 20, where: { language: $language }) {
      nodes {
        id
        databaseId
        name
        slug
        image {
          sourceUrl
          altText
        }
        products {
          nodes {
            id
          }
        }
      }
    }
  }
`;
