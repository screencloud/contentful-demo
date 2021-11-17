/* eslint-disable react/display-name */
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document } from "@contentful/rich-text-types";
import { AssetType } from "./asset/fragments";
import ImageAsset from "./asset/image-asset";
import React, { CSSProperties } from "react";
import styles from "./rich-text.module.css";

export type EntryFragmentType = {
  __typename?: string;
  sys: { id: string };
};

export type RichTextProps = {
  document: Document;
  entries?: (EntryFragmentType | null)[];
  assets?: (AssetType | null)[];
  className?: string;
  style?: CSSProperties;
};

export const RichText: React.FC<RichTextProps> = (props: RichTextProps) => {
  const findAsset = (id: string) =>
    props.assets?.find((asset) => asset?.sys.id === id);

  return (
    <div
      className={`${styles.richtext} ${props.className}`}
      style={props.style}
    >
      {documentToReactComponents(props.document, {
        renderNode: {
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const asset = findAsset(node.data.target.sys?.id);
            if (!asset) {
              console.warn(`Embedded Asset ${node.data.target} was not found.`);
              return null;
            }
            return (
              <div className="mb-8 last:mb-0">
                <ImageAsset {...asset} />
              </div>
            );
          },
        },
        renderText: (text: string) =>
          text.split("\n").map((t, i) =>
            i > 0 ? (
              <React.Fragment key={i}>
                <br />
                {t}
              </React.Fragment>
            ) : (
              t
            )
          ),
      })}
    </div>
  );
};
