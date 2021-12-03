import React from "react";
import { ErrorScreen } from "../../components/ErrorScreen";
import { SlideShow } from "../../components/SlideShow/SlideShow";
import { useContentfulData } from "../../providers/ContentfulDataProvider";
import "./AppContainer.css";

interface Props {}

function App(props: Props) {
  const { error } = useContentfulData();

  return (
    !!error ? <ErrorScreen />
    : <SlideShow />
  );
}

export default App;
