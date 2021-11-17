import React, { ReactNode, useContext, useMemo } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { SCREEN_CLOUD_CTX } from "../service/screencloud-config/screecloud-ctx";
import {
  useScContentMapping,
  useMappedData,
  ImageAsset,
} from "../service/screencloud-config/sc-content-mapping-service";
import * as types from "@contentful/rich-text-types";

const queryClient = new QueryClient();

export const Blog = "blog";
export const Quotes = "quotes";
export const Products = "products";
export const Heroes = "heroes";

export interface ContentfulBlogItem {
  title: string;
  link: string;
  description: { json: types.Document };
  copyright: string;
  image: ImageAsset;
  pubDate?: string;
}

export interface ContentfulQuoteItem {
  image?: ImageAsset;
  text: { json: types.Document };
}
export interface ContentfulProductItem {
  price: number;
  productImage: ImageAsset;
  productName: string;
  productCategory: { json: types.Document };
}

export interface ContentfulHeroItem {
  headline: string;
  image: ImageAsset;
  paragraph: { json: types.Document };
  slug: string;
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
  fetchBlogPosts: () => Promise<void>;
}

interface Props {
  children: ReactNode;
  type: string;
}

const initialState = {
  data: undefined,
  loading: false,
  error: undefined,
  fetchBlogPosts: () => Promise.resolve(),
};

export const ContentfulDataContext =
  React.createContext<Contentful>(initialState);

function Container(props: Props) {
  const scContentMappingQuery = useScContentMapping({ name: "Demo" });
  const heroContentMapping = useMemo(
    () =>
      scContentMappingQuery.data?.screenCloudContentMappingCollection.items[0]
        .mappingConfig?.[props.type],
    [scContentMappingQuery.data, props.type]
  );
  const { isLoading, error, result, refetch } =
    useMappedData(heroContentMapping);

  return (
    <ContentfulDataContext.Provider
      value={{
        loading: isLoading,
        error,
        // @ts-ignore
        data: { items: result || [], type: props.type },
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
  type,
}: {
  apiKey?: string;
  spaceId?: string;
  type: string;
  children: ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SCREEN_CLOUD_CTX.Provider
        value={{ cfApiKey: apiKey, cfSpaceId: spaceId }}
      >
        <Container type={type}>{children}</Container>
      </SCREEN_CLOUD_CTX.Provider>
    </QueryClientProvider>
  );
};

export const useContentful = (): Contentful =>
  // @ts-ignore
  useContext(ContentfulDataContext);
