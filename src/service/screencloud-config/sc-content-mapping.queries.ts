import { gql } from "graphql-request";

export const scContentMappingByNameGql = gql`
  query ScreenCloudConfig($id: String!) {
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

export type ScAppMapping = {
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

export type ScreenCloudContentMapping = {
  constants: {
    baseUrl: string;
  };
  contentfulMetadata: ContentfulMetadata;
  contentType: string;
  mapping: Record<string, string>;
  name: string;
  sys: Sys;
};

export type ScContentMappingItem = {
  id: string;
  config: ScreenCloudContentMapping;
};

export type ScContentMappingCollectionResponse = {
  contentFeed: {
    contentMappingConfig: ScContentMappingItem;
    entriesCollection: {
      items: { sys: { id: string } }[];
    };
  };
};
