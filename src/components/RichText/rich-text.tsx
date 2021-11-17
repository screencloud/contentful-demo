/* eslint-disable react/display-name */
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document, INLINES } from "@contentful/rich-text-types";
import { AssetType } from "./asset/fragments";
import ImageAsset from "./asset/image-asset";
// import { EmbeddedAsset } from './embedded-asset';
// import BlockRenderer from 'features/block/components/block-renderer';
import React, { CSSProperties } from "react";
// import EntryHyperlink, { EntryHyperlinkProps, EntryInlineHyperlink } from './entry-hyperlink';
import { Hyperlink } from "./hyperlink";
import styles from "./rich-text.module.css";
// export const isRichText = (x: Document | unknown): x is Document => {
//   return ['data', 'content', 'nodeType'].every((prop) => has(x, prop));
// };

const PlainHyperlink = (props: any) => (
  <Hyperlink {...props} type="PlainLink" />
);
const AssetHyperlink = (props: any) => (
  <Hyperlink {...props} type="AssetLink" />
);

export type EntryFragmentType = {
  __typename?: string;
  sys: { id: string };
};

export type RichTextProps = {
  document: Document;
  entries?: (EntryFragmentType | null)[];
  // inlineHyperlinks?: (EntryInlineHyperlink | null)[];
  assets?: (AssetType | null)[];
  className?: string;
  style?: CSSProperties;
};

export const RichText: React.FC<RichTextProps> = (props) => {
  // console.log(`RichText`, props);
  const findEntry = (id: string) =>
    props.entries?.find((entry) => entry?.sys.id === id);
  const findAsset = (id: string) =>
    props.assets?.find((asset) => asset?.sys.id === id);

  return (
    // <div className={clsx(`leading-7`, styles.richtext, props.className)}>
    <div
      className={`${styles.richtext} ${props.className}`}
      style={props.style}
    >
      {documentToReactComponents(props.document, {
        renderNode: {
          // [INLINES.HYPERLINK]: PlainHyperlink,

          // [INLINES.ASSET_HYPERLINK]: AssetHyperlink,

          // [INLINES.ENTRY_HYPERLINK]: (node) => {
          //   return (
          //     <EntryHyperlink
          //       data={node.data as EntryHyperlinkProps['data']}
          //       content={node.content as EntryHyperlinkProps['content']}
          //       inlineHyperlinks={props.inlineHyperlinks ?? []}
          //     />
          //   );
          // },

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

          // [BLOCKS.EMBEDDED_ENTRY]: (node) => {
          //   const entry = findEntry(node.data.target.sys?.id);
          //   if (entry?.__typename) {
          //     return (
          //       <div className="mb-8 last:mb-0">
          //         <BlockRenderer block={{ ...(entry as any) }} />
          //       </div>
          //     );
          //   }
          //   console.warn(`Embedded Entry ${node.data.target} was not found.`);
          //   return null;
          // },
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
