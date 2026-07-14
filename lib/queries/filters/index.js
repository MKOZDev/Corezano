export const GET_FILTER_DATA = `
  query GetFilterData($language: String!) {
    productBrands(first: 50) {
      nodes {
        id
        name
        slug
        count
      }
    }
    pa_videoMemoryVram: productAttribute(id: "pa_video-memory-vram", idType: SLUG) {
      terms(first: 20) {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  }
`;
