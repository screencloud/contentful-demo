import React, { ReactNode, useContext } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import * as types from "@contentful/rich-text-types";
import { SCREEN_CLOUD_CTX } from "../service/screencloud-config/screecloud-ctx";
import {
  useScContentMapping,
  useMappedData,
  ImageAsset,
} from "../service/screencloud-config/sc-content-mapping-service";

const queryClient = new QueryClient();

export const Blog = "blog";
export const Quotes = "quotes";
export const Products = "products";
export const Heroes = "heroes";

type ContentfulType =
  | typeof Blog
  | typeof Quotes
  | typeof Products
  | typeof Heroes;

export interface ContentfulBlogItem {
  title: string;
  link: string;
  description: { json: types.Document };
  author: string;
  image?: ImageAsset;
  pubDate?: string;
}

export interface ContentfulQuoteItem {
  image?: ImageAsset;
  text: { json: types.Document };
  author: string;
}
export interface ContentfulProductItem {
  id: string;
  brand: string;
  price: number;
  comparePrice: number;
  type: string;
  image: ImageAsset;
  name: string;
  link: string;
}

export interface ContentfulHeroItem {
  headline: string;
  image?: ImageAsset;
  paragraph?: { json: types.Document };
  link?: string;
  color: string;
}

export type ContentfulDataItem =
  | {
      type: typeof Blog;
      items: ContentfulBlogItem[];
    }
  | {
      type: typeof Quotes;
      items: ContentfulQuoteItem[];
    }
  | {
      type: typeof Products;
      items: ContentfulProductItem[];
    }
  | {
      type: typeof Heroes;
      items: ContentfulHeroItem[];
    };

export interface Contentful {
  data?: ContentfulDataItem;
  loading: boolean;
  error: unknown;
}

interface Props {
  children: ReactNode;
  mapName: string;
  playlistId: string;
}

const initialState = {
  data: undefined,
  loading: false,
  error: undefined,
};

const getType = (layout: string): ContentfulType => {
  switch (layout) {
    case "quotes":
      return "quotes";
    case "blog":
      return "blog";
    case "products":
      return "products";
    case "heroes":
    default:
      return "heroes";
  }
};

export const ContentfulDataContext =
  React.createContext<Contentful>(initialState);

function Container(props: Props) {
  const scContentMappingQuery = useScContentMapping({
    id: props.playlistId,
    name: props.mapName,
  });

  const mapping =
    scContentMappingQuery.data?.contentFeed?.contentMappingConfig.config;
  const filterItems =
    scContentMappingQuery.data?.contentFeed?.entriesCollection.items;

  const {
    queryResponse: { isLoading, error },
    result,
  } = useMappedData(mapping, filterItems);

  const type = getType(mapping?.name || "");

  return (
    <ContentfulDataContext.Provider
      value={{
        loading: isLoading,
        error,
        data: { items: result || [], type },
      }}
    >
      {props.children}
    </ContentfulDataContext.Provider>
  );
}

export const ContentfulGraphqlDataProvider = ({
  children,
  apiKey,
  spaceId,
  mapName = "",
  playlistId = "",
}: {
  apiKey?: string;
  spaceId?: string;
  mapName: string;
  playlistId: string;
  children: ReactNode;
}): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <SCREEN_CLOUD_CTX.Provider
        value={{ cfApiKey: apiKey, cfSpaceId: spaceId }}
      >
        <Container mapName={mapName} playlistId={playlistId}>
          {children}
        </Container>
      </SCREEN_CLOUD_CTX.Provider>
    </QueryClientProvider>
  );
};

export const useContentful = (): Contentful =>
  useContext(ContentfulDataContext);
