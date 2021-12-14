import { gql } from "graphql-request";

export const ContentFeedGql = gql`
  query ContentFeed($id: String!) {
    contentFeed(id: $id) {
      contentMappingConfig {
        name
        config
      }
      entriesCollection {
        items {
          sys {
            id
          }
        }
      }
    }
  }
`;

export type ContentTypeMapping = {
  contentType: string;
  mapping: Record<string, string>;
};

type Sys = {
  __typename?: "Sys";
  environmentId: string;
  firstPublishedAt?: string;
  id: string;
  publishedAt?: string;
  publishedVersion?: number;
  spaceId: string;
};

type ContentfulMetadata = {
  __typename?: "ContentfulMetadata";
  tags: {
    __typename?: "ContentfulTag";
    id: string;
    name: string;
  };
};

export type ContentMappingConfig = {
  constants?: {
    baseUrl?: string;
    logoUrl?: string;
  };
  contentfulMetadata: ContentfulMetadata;
  contentType: string;
  mapping: Record<string, string>;
  name: string;
  sys: Sys;
};

export type ContentMappingItem = {
  id: string;
  config: ContentMappingConfig;
};

export type ContentMappingCollectionResponse = {
  contentFeed: {
    contentMappingConfig: ContentMappingItem;
    entriesCollection: {
      items: { sys: { id: string } }[];
    };
  };
};
