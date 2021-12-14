import { useEffect, useMemo, useState } from "react";
import { capitalize } from "../../utils/string-utils";
import {
  ContentfulCollection,
  useGqlQuery
} from "../contentful-api/contentful-graphql-service";
import {
  ContentFeedGql,
  ContentMappingCollectionResponse,
  ContentMappingConfig
} from "./content-mapping.queries";

export interface ImageAsset {
  description: string;
  fileName: string;
  width: number;
  height: number;
  size: number;
  sys: { id: string };
  title: string;
  url: string;
}

/**
 * Expects a data object which is the response of a Contentful API call
 * and maps it to the schema defined in `mappingConfig`.
 * @param mappingConfig 
 * @param filterItems A list of ContentIds which should be included in the result
 * @param data Data as received from the Contentful API
 *  (which should be mapped according to `mappingConfig`)
 * @returns Data Object according to the schema derrived from `mappingConfig`.
 */
export function mapContent(
  mappingConfig: ContentMappingConfig,
  data: Array<Record<string, any>>,
  // filterItems?: { sys: { id: string } }[],
): any[] {
  return data.map((dataItem) => {
    const mappingEntries = Object.entries(mappingConfig.mapping || {});

    /** for every mapping entry we get the data out of the contentful entry */
    const mappedEntries = mappingEntries.reduce((acc, mapEntry) => {
      const [fieldName, path] = mapEntry;
      const pathSegments = path.split(".");
      const value = pathSegments.reduce(
        (dataItemSegment, pathSegment, i, arr) => {
          if (!dataItemSegment) {
            return dataItemSegment;
          }
          const [segmentName] = pathSegment.split(":");
          // const isLast = i === arr.length - 1;
          return dataItemSegment[segmentName];
        },
        dataItem
      );

      return { ...acc, [fieldName]: value };
    }, {} as any);

    return {
      ...mappedEntries,
      ...mapLink(mappingConfig.constants?.baseUrl, mappedEntries.slug),
    };
  });
}

/**
 * @returns Generates a GraphQL queryString which can be used to call the
 */
export function queryStringFromMappingConfig(config: ContentMappingConfig) {
  const { contentType, mapping } = config;
  const entries = Object.entries(mapping);

  const itemsQueryString = entries?.reduce((itemsString, entry) => {
    const path = entry[1];
    const segments = path.split(".");

    const singleItemString = [...segments]
      .reverse()
      .reduce((acc, segment, i, arr) => {
        const [fieldName, type] = segment.split(`:`);

        let str = fieldName;
        if (acc) {
          str = `${str} { ${acc} }`;
        } else {
          switch (type) {
            case "RichText":
              str = `${fieldName} { json }`;
              break;
            case "Asset":
            case "ImageAsset":
              str = `${fieldName} { ...Asset }`;
              break;
          }
        }

        /** if parent has a type we wrap our field with an inline fragment: */
        const item = i < arr.length - 1 ? arr[i + 1]?.split(`:`) : [];
        const prevType = item[1];
        if (prevType) {
          const prevTypes = prevType.split(`|`);
          str = prevTypes
            .map((p) => `...on ${capitalize(p)} { ${str} }`)
            .join(` `);
          // str = `... on ${capitalize(prevType)} { ${str} }`;
        }

        return str;
      }, ``);

    return `${itemsString}${singleItemString} sys { id publishedAt }`;
  }, ``);


  const queryString = `query {
    ${contentType}Collection(limit: 20) {
      items {
        ${itemsQueryString}
      }
    }
  }
  
  fragment Asset on Asset {
    description
    fileName
    width
    height
    size
    sys { id }
    title
    url
  }`;
  return queryString;
}

export function useContentFeedQuery(options: {
  id: string;
  skip?: boolean;
  refetchInterval?: number;
}) {
  const { id, skip, refetchInterval } = options;
  const key = `${useContentFeedQuery}:${id}`;
  return useGqlQuery<ContentMappingCollectionResponse>(
    ContentFeedGql,
    {
      key,
      input: { id },
      skip,
      refetchInterval,
    }
  );
}

/**
 * Generates a graphql queryString out of a mappingConfig
 * and requests the Contentful Api.
 * @param mappingConfig 
 * @param filterItems A list of Content IDs which should be included in the results.
 *  When not provided all items will be included. 
 * @returns React Query Object and resulting data (already mapped accorudng to `mappingConfig`)
 */
export function useMappedData(
  mappingConfig?: ContentMappingConfig,
  options?: {
    filterItems?: { sys: { id: string } }[]
    refetchInterval?: number,
  }
) {
  const { filterItems, refetchInterval} = options || {};

  const queryString = mappingConfig
    ? queryStringFromMappingConfig(mappingConfig)
    : undefined;

  const query =
    useGqlQuery<Record<string, ContentfulCollection<any>>>(
      queryString,
      { refetchInterval },
    );

    /** Items (filtered by Ids) returned by contentful. */
  const contentfulItems = useMemo(() => {
    if (!mappingConfig) {
      return undefined;
    }
    const items =
      query.data?.[`${mappingConfig.contentType}Collection`].items;

    return items && filterItems ? filterContent(items, filterItems) : items
  }, [mappingConfig, filterItems, query.data]);

  /** Items already mapped, which are returned by this hook in the end. */
  const [items, setItems] = useState(mappingConfig && contentfulItems ? mapContent(mappingConfig, contentfulItems) : []);

  /** get a key which changes when a content item was changed in the backend. */
  const itemsLastUpdatedKey = useMemo(() => (
    contentfulItems?.map(item => item.publishedAt).join(',')
  ), [contentfulItems])


  /**
   * only when `itemsLastUpdatedKey ` changed we map and update our items.
   * Otherwise we just received the same date after polling:
   */
  useEffect(() => {
    if (itemsLastUpdatedKey) {
      setItems(mappingConfig && contentfulItems ? mapContent(mappingConfig, contentfulItems) : [])
    }
  }, [contentfulItems, itemsLastUpdatedKey, mappingConfig])
  
  return { items, queryResponse: query };
}

// Utitliy functions:

function mapLink(baseUrl?: string, slug?: string) {
  if (!baseUrl || !slug) {
    return {};
  }
  return { link: `${baseUrl}/${slug}` };
}

function filterContent(
  data: Array<Record<string, any>>,
  filterItems: { sys: { id: string } }[]
) {
  return filterItems.map(f => data.find(d => f.sys.id === d.sys.id))
}
