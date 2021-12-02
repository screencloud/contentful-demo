## Contentful Demo app

To run the app locally:

1. `npm install`

2. Create a file `./.env.local` with:

```
REACT_APP_API_KEY = XXX
REACT_APP_SPACE_ID = XXX
REACT_APP_MAP_NAME = XXX
REACT_APP_PLAYLIST_ID = XXX
```

3. `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Hosting

Please host the app and complete the form in order for the app to be added to your space on ScreenCloud.

https://docs.google.com/forms/d/e/1FAIpQLScBlxBq-1NhQzD1v7FkjDrdLVNTq0FkwJwYgnj_IprRxH2dww/viewform

Schema definition file (which is used by contentful _Schame Connector_ App) is hosted at https://sc-apps-contentful-content-production.s3.eu-west-1.amazonaws.com/public/screencloud-app-definitions.json

## Packages

This app uses our component library [`@screencloud/alfie-alpha`](https://www.npmjs.com/package/@screencloud/alfie-alpha)
