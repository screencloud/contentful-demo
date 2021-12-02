import * as types from "@contentful/rich-text-types";
import React, { FunctionComponent, useContext } from "react";
import {
  ImageAsset, useContentFeedQuery,
  useMappedData
} from "../service/schema-connector/content-mapping-service";
import { useSiteConfig } from "../service/use-site-config";


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

export type TemplateData<TN extends TemplateName, D> = {
  templateName: TN;
  items: D[];
  companyLogo?: string;
}

export type ContentfulDataItem =
  | TemplateData<'blog', ContentfulBlogItem>
  | TemplateData<'quotes', ContentfulQuoteItem>
  | TemplateData<'products', ContentfulProductItem>
  | TemplateData<'heroes', ContentfulHeroItem>;



export const ContentfulDataContext = React.createContext({
  data: undefined as ContentfulDataItem|undefined,
  loading: false,
  error: undefined as unknown,
});



type Props = {
  contentFeedId?: string;
  refetchInterval?: number;
};

export const ContentfulDataProvider: FunctionComponent<Props> = props => {
  const contentFeedQuery = useContentFeedQuery({
    skip: !props.contentFeedId,
    id: props.contentFeedId!,
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

  const siteConfig = useSiteConfig()
  console.log(`logo`, siteConfig);

  if (!type) return <>{props.children}</>;

  return (
    <ContentfulDataContext.Provider
      value={{
        loading: isLoading,
        error,
        data: {
          items,
          templateName: type,
          companyLogo: siteConfig?.logo.url,
        },
      }}
    >
      {props.children}
    </ContentfulDataContext.Provider>
  );
};

export const useContentfulData = () => useContext(ContentfulDataContext);
