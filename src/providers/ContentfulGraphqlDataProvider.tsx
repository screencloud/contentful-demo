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

export interface ContentfulData {
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


export const ContentfulDataContext =
  React.createContext<ContentfulData>(initialState);

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

  const type = mapping?.name as TemplateName | undefined;
  if (!type) return <>{props.children}</>;

  return (
    <ContentfulDataContext.Provider
      value={{
        loading: isLoading,
        error,
        data: { items: result || [], templateName: type },
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

export const useContentful = (): ContentfulData =>
  useContext(ContentfulDataContext);
