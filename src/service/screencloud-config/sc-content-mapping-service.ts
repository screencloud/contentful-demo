import { useMemo } from "react";
import { capitalize } from "./string-utils";
import {
  ContentfulCollection,
  useGqlQuery,
} from "../../service/graphql-service";
import {
  ScAppMapping,
  scContentMappingByNameGql,
  scContentMappingCollectionGql,
  ScContentMappingCollectionResponse,
} from "./sc-content-mapping.queries";

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

export function mapContent(
  mappingConfig: ScAppMapping,
  data: Array<Record<string, any>>
) {
  return data.map((dataItem) => {
    const mappingEntries = Object.entries(mappingConfig?.mapping || {});

    /** for every mapping entry we get the data out of the contentful entry */
    return mappingEntries.reduce((acc, mapEntry) => {
      const [fieldName, path] = mapEntry;
      // console.log(`loooking for`, fieldName, `at`, path);
      const pathSegments = path.split(".");
      const value = pathSegments.reduce(
        (dataItemSegment, pathSegment, i, arr) => {
          if (!dataItemSegment) {
            return dataItemSegment;
          }
          const [segmentName, segmentType] = pathSegment.split(":");
          // const isLast = i === arr.length - 1;
          return dataItemSegment[segmentName];
        },
        dataItem as any
      );

      return { ...acc, [fieldName]: value };
    }, {} as any);
  });
}

export function queryStringFromAppMapping(mappingConfig: ScAppMapping) {
  // console.log(`mapping`, mapping)
  const entries = Object.entries(mappingConfig.mapping);

  const itemsQueryString = entries?.reduce((itemsString, entry) => {
    const [_, path] = entry;
    const segments = path.split(".");
    // console.log(`segment`, path, segments)

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
        const [_, prevType] = i < arr.length - 1 ? arr[i + 1]?.split(`:`) : [];
        if (prevType) {
          str = `... on ${capitalize(prevType)} { ${str} }`;
        }

        return str;
      }, ``);

    return `${itemsString}${singleItemString} `;
  }, ``);

  const queryString = `query {
    ${mappingConfig?.contentType}Collection(limit: 20) {
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
  // console.log(queryString);
  return queryString;
}

export function useScContentMapping(
  options: { name?: string; skip?: boolean } = {}
) {
  const { name, skip } = options;
  const key = `${useScContentMapping}:${name}`;
  return useGqlQuery<ScContentMappingCollectionResponse>(
    name ? scContentMappingByNameGql : scContentMappingCollectionGql,
    {
      key,
      input: { name },
      skip,
    }
  );
}

export function useMappedData(
  mappingConfig?: ScAppMapping,
  options: { skip?: boolean } = {}
) {
  const queryString = mappingConfig
    ? queryStringFromAppMapping(mappingConfig)
    : undefined;
  const queryResponse =
    useGqlQuery<Record<string, ContentfulCollection<any>>>(queryString);
  // console.log(`queryResponse`, queryResponse)

  const result = useMemo(() => {
    if (!mappingConfig) {
      return undefined;
    }
    const entries =
      queryResponse.data?.[`${mappingConfig.contentType}Collection`].items;
    return mapContent(mappingConfig, entries || []);
  }, [mappingConfig, queryResponse.data]);

  return { result, ...queryResponse };
}
