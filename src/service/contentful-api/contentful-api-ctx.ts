import { createContext } from "react";

export type ContentfulApiConfig = {
  apiKey?: string;
  spaceId?: string;
  environment?: string;
};

export const ContentfulApiContext = createContext<ContentfulApiConfig>({});
