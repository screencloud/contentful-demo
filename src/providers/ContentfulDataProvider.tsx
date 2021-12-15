import * as types from "@contentful/rich-text-types";
import React, { FunctionComponent, useContext } from "react";
import {
  ImageAsset, useContentFeedQuery,
  useMappedData
} from "../service/schema-connector/content-mapping-service";


type TemplateName =
  | 'blog'
  | 'quotes'
  | 'products'
  | 'heroes';

export interface ContentfulBlogItem {
  title: string;
  link: string;
  description: { json: types.Document };
  category?: string;
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
  templateName?: TN;
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
  isLoading: false,
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
    refetchInterval: props.refetchInterval,
  });
  const contentFeed = contentFeedQuery.data?.contentFeed;
  // useEffect(() => {
  //   if (contentFeed) {
  //     console.group(`Contentful Content feed`);
  //     console.log(contentFeed);
  //     console.groupEnd();
  //   }
  // }, [contentFeed])

  const mappingConfig = contentFeed?.contentMappingConfig.config;
  const itemIds = contentFeed?.entriesCollection.items;

  const {
    queryResponse,
    items = [],
  } = useMappedData(
    mappingConfig, {
      filterItems: itemIds,
      refetchInterval: props.refetchInterval
    });

  const isLoading = contentFeedQuery.isLoading || queryResponse.isLoading;
  
  let error: any = contentFeed === null ? `There is no ContentFeed with id "${props.contentFeedId}"` : undefined;
  if (!error) error = contentFeedQuery.error || queryResponse.error;

  const templateName = mappingConfig?.name as TemplateName | undefined;
  const companyLogo = mappingConfig?.constants?.logoUrl;

  return (
    <ContentfulDataContext.Provider
      value={{
        isLoading,
        error,
        data: {
          items,
          templateName,
          companyLogo,
        },
      }}
    >
      {props.children}
    </ContentfulDataContext.Provider>
  );
};

export const useContentfulData = () => useContext(ContentfulDataContext);
