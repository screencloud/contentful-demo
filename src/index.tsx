import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./containers/AppContainer/AppContainer";
import {
  ScreenCloudPlayerContext,
  ScreenCloudPlayerProvider,
} from "./providers/ScreenCloudPlayerProvider";
import { ContentfulDataProvider } from "./providers/ContentfulDataProvider";
import { config as devConfig } from "./config.development";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { QueryClient, QueryClientProvider } from "react-query";
import { ContentfulApiContext } from "./service/contentful-api/contentful-api-ctx";

/* 
LAYOUTS
 - hero
 - products
 - quotes
 - blog
*/

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <ScreenCloudPlayerProvider testData={devConfig}>
      <ScreenCloudPlayerContext.Consumer>
        {({ config }) => (
          <QueryClientProvider client={queryClient}>
            <ContentfulApiContext.Provider
              value={{ apiKey: config?.apiKey, spaceId: config?.spaceId }}
            >
              <ContentfulDataProvider
                contentFeedId={config?.playlistId}
                refetchInterval={3000}
              >
                <div className="app-container">
                  <App />
                </div>
              </ContentfulDataProvider>
            </ContentfulApiContext.Provider>
          </QueryClientProvider>
        )}
      </ScreenCloudPlayerContext.Consumer>
    </ScreenCloudPlayerProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorkerRegistration.register();
