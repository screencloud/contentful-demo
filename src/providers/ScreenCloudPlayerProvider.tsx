import React, { useContext, ReactNode, Component } from "react";
import { connectScreenCloud } from "@screencloud/apps-sdk";
import { Theme, AppConfig } from "@screencloud/apps-sdk/lib/types";

export interface ScreenCloudPlayer {
  appStarted: boolean;
  config?: AppConfig;
  theme?: Theme;
}

interface State {
  appStarted: boolean;
  config?: AppConfig;
  theme?: Theme;
}

interface Props {
  children: ReactNode;
  testData: any;
}

const initialState = { appStarted: false, config: undefined };

export const ScreenCloudPlayerContext =
  React.createContext<ScreenCloudPlayer>(initialState);

export class ScreenCloudPlayerProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      appStarted: false,
      config: undefined,
    };
  }

  async componentDidMount() {
    let testData;
    if (process.env.NODE_ENV === "development") {
      testData = this.props.testData;
    }
    const sc = await connectScreenCloud(testData);

    const context = sc.getContext();
    const config = sc.getConfig();

    this.setState({
      config,
      theme: context.theme,
    });

    sc.onAppStarted().then(() => {
      this.setState({
        appStarted: true,
      });
    });
  }

  componentWillUnmount() {}

  render() {
    const props = {
      appStarted: this.state.appStarted,
      config: this.state.config,
      theme: this.state.theme,
    };

    return (
      <ScreenCloudPlayerContext.Provider value={props}>
        {this.state.config && this.props.children}
      </ScreenCloudPlayerContext.Provider>
    );
  }
}

export const useScreenCloudPlayer = (): ScreenCloudPlayer =>
  useContext(ScreenCloudPlayerContext);
