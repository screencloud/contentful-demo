import { createContext } from "react";

export type ScreencloudConfig = {
  cfApiKey?: string;
  cfSpaceId?: string;
  cfEnv?: string;
};

export const SCREEN_CLOUD_CTX = createContext<ScreencloudConfig>({});
