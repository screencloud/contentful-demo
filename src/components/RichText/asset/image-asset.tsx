import React from "react";
import { AssetType } from "./fragments";

type Props = AssetType & {
  disableCaption?: boolean;
  className?: string;
  imgWidth?: number | string;
  imgHeight?: number | string;
};

const ImageAsset: React.FC<Props> = (props) => {
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
        // sizes="(min-width: 768px) 60vw, (min-width: 1280px) 750px, 98vw"
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
