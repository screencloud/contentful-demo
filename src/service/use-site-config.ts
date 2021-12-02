import { ContentfulCollection, useGqlQuery } from "./contentful-api/contentful-graphql-service";

type SiteConfig = {
  logo: {
    url: string;
    width: number;
    height: number;
  }
};

export function useSiteConfig() {
  type QueryResponse = {
    siteConfigurationCollection: ContentfulCollection<SiteConfig>;
  };

  const siteConfigQuery = useGqlQuery<QueryResponse>(`query SiteConfig {
    siteConfigurationCollection(limit: 10) {
      items {
        logo {
          url
          width height
        }
      }
    }
  }
  `)

  // console.log(`siteConfigQuery`, siteConfigQuery);
  return siteConfigQuery.data?.siteConfigurationCollection.items[0];
}