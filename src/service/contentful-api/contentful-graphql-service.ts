import { request } from "graphql-request";
import { useContext } from "react";
import { useQuery, UseQueryOptions } from "react-query";
import { ContentfulApiContext } from "./contentful-api-ctx";

export type ContentfulCollection<CType> = {
  items: CType[];
};

interface GetEndpointInput {
  spaceId: string;
  apiKey: string;
  preview?: boolean;
  env?: string;
}

export const getEndpoint = (input: GetEndpointInput): string => {
  let url = `https://graphql.contentful.com/content/v1/spaces/${input?.spaceId}`;
  if (input?.env) {
    url += `/environments/${input.env}`;
  }
  return `${url}?access_token=${input.apiKey}`;
};

type Input = {
  locale?: string;
  preview?: boolean;
  env?: string;
};

export async function gqlRequest<ReturnType>(
  spaceId: string,
  apiKey: string,
  query: string,
  input: Input = {}
): Promise<ReturnType> {
  const { preview = false, env } = input;
  const endpoint = getEndpoint({ spaceId, apiKey, env, preview });
  return await request<ReturnType>(endpoint, query, input);
}

type UseGqlQueryOptions<ReturnType> = {
  key?: string;
  input?: { id?: string };
  // pipe?: (response: ReturnType) => ReturnType | P | Promise<P>;
  skip?: boolean;
  refetchInterval?: UseQueryOptions<ReturnType>['refetchInterval'],
  isDataEqual?: UseQueryOptions<ReturnType>['isDataEqual'],
};

export function useGqlQuery<ReturnType = any>(
  query?: string,
  options?: UseGqlQueryOptions<ReturnType>
) {
  const { spaceId, apiKey, environment } = useContext(ContentfulApiContext);
  if (!spaceId || !apiKey) {
    console.warn(
      `No request can be  executed because there is no spaceId or apiKey provided.`
    );
  }
  const { key = query, input, skip, refetchInterval, isDataEqual } = options || {};

  return useQuery(
    key || "useGqlQuery",
    () =>
      gqlRequest<ReturnType>(spaceId || "", apiKey || "", query || "", {
        env: environment,
        ...input,
      }).then((response) => response),
    {
      enabled: !skip && !!query && !!spaceId && !!apiKey,
      refetchInterval,
      isDataEqual,
    }
  );
}
