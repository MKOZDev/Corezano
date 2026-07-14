export const GET_PRODUCTS = `
  query GetProducts($first: Int = 20, $language: String!) {
    products(first: $first, where: { language: $language }) {
      nodes {
        id
        databaseId
        name
        slug
        image {
          sourceUrl
          altText
        }
        language {
          code
        }

        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          onSale
          stockStatus
        }

        ... on VariableProduct {
          price
          regularPrice
          salePrice
          onSale
          stockStatus
        }
      }
    }
  }
`;

export const GET_FEATURED_PRODUCTS = `
  query GetFeaturedProducts($language: String!) {
    products(first: 3, where: { featured: true, language: $language }) {
      nodes {
        id
        databaseId
        name
        slug
        shortDescription
        image {
          sourceUrl
          altText
        }
        language {
          code
        }

        ... on SimpleProduct {
          price
          regularPrice
          onSale
          attributes {
            nodes {
              name
              options
            }
          }
        }

        ... on VariableProduct {
          price
          regularPrice
          onSale
          attributes {
            nodes {
              name
              options
            }
          }
        }
      }
    }
  }
`;

export function buildProductsQuery({ orderby = "DATE", order = "DESC" } = {}) {
  return `
    query GetProductsFiltered(
      $first: Int = 20
      $after: String
      $language: String!
    ) {
      products(
        first: $first
        after: $after
        where: {
          language: $language
          orderby: [{ field: ${orderby}, order: ${order} }]
        }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          databaseId
          name
          slug
          image {
            sourceUrl
            altText
          }
          productBrands {
            nodes {
              name
              slug
            }
          }
          productCategories {
            nodes {
              name
              slug
            }
          }

          ... on SimpleProduct {
            price
            regularPrice
            salePrice
            onSale
            stockStatus
            attributes {
              nodes {
                name
                options
              }
            }
          }

          ... on VariableProduct {
            price
            regularPrice
            salePrice
            onSale
            stockStatus
            attributes {
              nodes {
                name
                options
              }
            }
          }
        }
      }
    }
  `;
}
export const GET_PRODUCT_BY_SLUG = `
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      shortDescription
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productBrands {
        nodes {
          name
          slug
        }
      }
      productCategories {
        nodes {
          name
          slug
        }
      }

      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        onSale
        stockStatus
        sku
        attributes {
          nodes {
            name
            label
            options
            visible
          }
        }
      }

      ... on VariableProduct {
        price
        regularPrice
        salePrice
        onSale
        stockStatus
        sku
        attributes {
          nodes {
            name
            label
            options
            visible
          }
        }
      }
    }
  }
`;
