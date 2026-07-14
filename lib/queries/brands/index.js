export const GET_BRANDS = `
  query GetBrands {
    productBrands(first: 20) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;
