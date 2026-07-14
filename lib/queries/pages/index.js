export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      content
      date
      language {
        code
      }
      translations {
        id
        slug
        language {
          code
        }
      }
    }
  }
`;
