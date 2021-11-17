import React, { FunctionComponent } from "react";
import { AssetType } from "./fragments";

interface Props extends AssetType {
  disableCaption?: boolean;
  className?: string;
  imgWidth?: number | string;
  imgHeight?: number | string;
}

const ImageAsset: FunctionComponent<Props> = (props: Props) => {
  if (!props.url) {
    return null;
  }
  return (
    <figure>
      <img
        src={props.url.replace(/^\/\//, "https://")}
        width={props.imgWidth || props.width || ""}
        height={props.imgHeight || props.height || ""}
        alt={props.description || undefined}
        title={props.title || undefined}
        className={props.className}
      />
      {!props.disableCaption && props.title && (
        <figcaption className="text-gray-700 text-center">
          {props.title}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageAsset;
