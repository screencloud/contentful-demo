import React, { ReactNode, useContext } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import * as types from "@contentful/rich-text-types";
import { ContentfulApiContext } from "../service/contentful-api/contentful-api-ctx";
import {
  useContentFeedQuery,
  useMappedData,
  ImageAsset,
} from "../service/schema-connector/content-mapping-service";

const queryClient = new QueryClient();


type TemplateName =
  | 'blog'
  | 'quotes'
  | 'products'
  | 'heroes';

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

export type TemplateData<TN extends TemplateName, D> = { templateName: TN, items: D[]}

export type ContentfulDataItem =
  | TemplateData<'blog', ContentfulBlogItem>
  | TemplateData<'quotes', ContentfulQuoteItem>
  | TemplateData<'products', ContentfulProductItem>
  | TemplateData<'heroes', ContentfulHeroItem>;


interface Props {
  children: ReactNode;
  contentFeedId: string;
  refetchInterval?: number;
}

export const ContentfulDataContext = React.createContext({
  data: undefined as ContentfulDataItem|undefined,
  loading: false,
  error: undefined as unknown,
});

function Container(props: Props) {
  const contentFeedQuery = useContentFeedQuery({
    id: props.contentFeedId,
  });

  const mapping =
    contentFeedQuery.data?.contentFeed?.contentMappingConfig.config;
  const filterItems =
    contentFeedQuery.data?.contentFeed?.entriesCollection.items;

  const {
    queryResponse: { isLoading, error },
    items = [],
  } = useMappedData(mapping, { filterItems, refetchInterval: props.refetchInterval });

  const type = mapping?.name as TemplateName | undefined;
  if (!type) return <>{props.children}</>;

  return (
    <ContentfulDataContext.Provider
      value={{
        loading: isLoading,
        error,
        data: { items, templateName: type },
      }}
    >
      {props.children}
    </ContentfulDataContext.Provider>
  );
}

type ProviderProps = {
  apiKey?: string;
  spaceId?: string;
  contentFeedId?: string;
  refetchInterval?: number;
  children: ReactNode;
};

export const ContentfulGraphQlDataProvider = (props: ProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContentfulApiContext.Provider
        value={{ apiKey: props.apiKey, spaceId: props.spaceId }}
      >
        <Container contentFeedId={props.contentFeedId || ''} refetchInterval={props.refetchInterval}>
          {props.children}
        </Container>
      </ContentfulApiContext.Provider>
    </QueryClientProvider>
  );
};

export const useContentfulData = () => useContext(ContentfulDataContext);
