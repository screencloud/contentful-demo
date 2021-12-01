import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./containers/AppContainer/AppContainer";
import {
  ScreenCloudPlayerContext,
  ScreenCloudPlayerProvider,
} from "./providers/ScreenCloudPlayerProvider";
import { ContentfulGraphQlDataProvider } from "./providers/ContentfulGraphqlDataProvider";
import { config as devConfig } from "./config.development";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

/* 
LAYOUTS
 - hero
 - products
 - quotes
 - blog
*/

ReactDOM.render(
  <React.StrictMode>
    <ScreenCloudPlayerProvider testData={devConfig}>
      <ScreenCloudPlayerContext.Consumer>
        {({ config }) => (
          <ContentfulGraphQlDataProvider
            apiKey={config?.apiKey}
            spaceId={config?.spaceId}
            contentFeedId={config?.playlistId}
            refetchInterval={3000}
          >
            <div className="app-container">
              <App />
            </div>
          </ContentfulGraphQlDataProvider>
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
