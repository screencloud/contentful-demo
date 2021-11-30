import { useMemo } from "react";
import { UseQueryResult } from "react-query";
import { capitalize } from "../../utils/string-utils";
import {
  ContentfulCollection,
  useGqlQuery,
} from "../graphql-service";
import {
  ContentFeedGql,
  ContentMappingCollectionResponse,
  ContentMappingConfig,
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
  return data.filter((item) =>
    filterItems.some((filterItem) => filterItem.sys.id === item.sys.id)
  );
}

export function mapContent(
  mappingConfig: ContentMappingConfig,
  filterItems: { sys: { id: string } }[],
  data: Array<Record<string, any>>
): any[] {
  return filterContent(data, filterItems).map((dataItem) => {
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

export function queryStringFromMappingConfig(
  fieldMapping: Record<string, string>,
  contentType: string
): string {
  const entries = Object.entries(fieldMapping);

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

    return `${itemsString}${singleItemString} sys { id }`;
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
}): UseQueryResult<ContentMappingCollectionResponse, unknown> {
  const { id, skip } = options;
  const key = `${useContentFeedQuery}:${id}`;
  return useGqlQuery<ContentMappingCollectionResponse>(
    ContentFeedGql,
    {
      key,
      input: { id },
      skip,
    }
  );
}

export function useMappedData(
  mappingConfig?: ContentMappingConfig,
  filterItems?: { sys: { id: string } }[]
): {
  result: any;
  queryResponse: UseQueryResult<
    Record<string, ContentfulCollection<any>>,
    unknown
  >;
} {
  const queryString = mappingConfig
    ? queryStringFromMappingConfig(
        mappingConfig.mapping,
        mappingConfig.contentType
      )
    : undefined;
  const queryResponse =
    useGqlQuery<Record<string, ContentfulCollection<any>>>(queryString);

  const result = useMemo(() => {
    if (!mappingConfig || !filterItems) {
      return undefined;
    }
    const entries =
      queryResponse.data?.[`${mappingConfig.contentType}Collection`].items;

    return mapContent(mappingConfig, filterItems, entries || []);
  }, [mappingConfig, filterItems, queryResponse.data]);

  return { result, queryResponse };
}
