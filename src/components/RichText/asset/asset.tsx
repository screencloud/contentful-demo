import React, { FunctionComponent } from "react";
import { AssetType } from "./fragments";
import ImageAsset from "./image-asset";

const Asset: FunctionComponent<AssetType> = (props: AssetType) => {
  const isImage = props.contentType?.includes("image");
  if (isImage) {
    return <ImageAsset {...props} />;
  }
  // Ignore all other asset types, e.g. PDFs, other docs etc.
  return null;
};

export default Asset;
