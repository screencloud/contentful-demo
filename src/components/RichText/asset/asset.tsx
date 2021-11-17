import React from "react";
import { AssetType } from "./fragments";
import ImageAsset from "./image-asset";

const Asset: React.FC<AssetType> = (props) => {
  const isImage = props.contentType?.includes("image");
  if (isImage) {
    return <ImageAsset {...props} />;
  }
  // Ignore all other asset types, e.g. PDFs, other docs etc.
  return null;
};

export default Asset;
