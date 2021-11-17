import { gql } from "graphql-request";
import { ContentfulCollection } from "../graphql-service";

export const scContentMappingCollectionGql = gql`
  query ScreenCloudConfigCollection {
    screenCloudContentMappingCollection(limit: 10) {
      items {
        sys {
          id
        }
        name
        baseUrl
        mappingConfig
      }
    }
  }
`;

export const scContentMappingByNameGql = gql`
  query ScreenCloudConfig($name: String!) {
    screenCloudContentMappingCollection(where: { name: $name }, limit: 1) {
      items {
        sys {
          id
        }
        name
        baseUrl
        mappingConfig
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

export type EntryCollection = {
  __typename?: "EntryCollection";
  items: Entry[];
  limit: number;
  skip: number;
  total: number;
};

type ContentfulMetadata = {
  __typename?: "ContentfulMetadata";
  tags: {
    __typename?: "ContentfulTag";
    id: string;
    name: string;
  };
};

export type Entry = {
  contentfulMetadata: ContentfulMetadata;
  sys: Sys;
};

export type ScreenCloudContentMappingLinkingCollections = {
  __typename?: "ScreenCloudContentMappingLinkingCollections";
  entryCollection: EntryCollection;
};

type ScreenCloudContentMapping = {
  baseUrl: string;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom: ScreenCloudContentMappingLinkingCollections;
  mappingConfig: JSON;
  name: string;
  sys: Sys;
};

export type ScContentMappingItem = Pick<
  ScreenCloudContentMapping,
  "name" | "baseUrl"
> & {
  mappingConfig: Record<string, ScAppMapping>;
};

export type ScContentMappingCollectionResponse = {
  screenCloudContentMappingCollection: ContentfulCollection<ScContentMappingItem>;
};
