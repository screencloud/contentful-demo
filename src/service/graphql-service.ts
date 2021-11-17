import { request } from "graphql-request";
import { useContext } from "react";
import { useQuery } from "react-query";
import { SCREEN_CLOUD_CTX } from "./screencloud-config/screecloud-ctx";

export type ContentfulCollection<CType> = {
  items: CType[];
};

interface GetEndpointInput {
  spaceId: string;
  apiKey: string;
  preview?: boolean;
  env?: string;
}

export const getEndpoint = (input?: GetEndpointInput): string => {
  let url = `https://graphql.contentful.com/content/v1/spaces/${input?.spaceId}`;
  if (input?.env) {
    url += `/environments/${input.env}`;
  }
  return `${url}?access_token=${input?.apiKey}`;
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
) {
  const { preview = false, env } = input;
  const endpoint = getEndpoint({ spaceId, apiKey, env, preview });
  // console.log(`endpoint`, endpoint, input);
  return await request<ReturnType>(endpoint, query, input);
}

type UseGqlQueryOptions<ReturnType, P> = {
  key?: string;
  input?: any;
  pipe?: (response: ReturnType) => ReturnType | P | Promise<P>;
  skip?: boolean;
};

export function useGqlQuery<ReturnType, P = ReturnType>(
  query?: string,
  options?: UseGqlQueryOptions<ReturnType, P>
) {
  const { cfSpaceId, cfApiKey, cfEnv } = useContext(SCREEN_CLOUD_CTX);
  if (!cfSpaceId || !cfApiKey) {
    console.warn(
      `No request can be  executed because there is no spaceId or apiKey provided`
    );
  }
  const { key = query, input, pipe, skip } = options || {};

  return useQuery(
    key || "useGqlQuery",
    () =>
      gqlRequest<ReturnType>(cfSpaceId!, cfApiKey!, query || "", {
        env: cfEnv,
        ...input,
      }).then((response) => (!!pipe ? pipe(response) : response)),
    { enabled: !skip && !!query && !!cfSpaceId && !!cfApiKey }
  );
}
