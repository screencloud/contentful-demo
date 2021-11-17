import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import { RichText } from "./rich-text";

type Props = {
  data: any;
  content: any;
  type: "AssetLink" | "PlainLink";
};

export const Hyperlink = (props: Props) => {
  const href =
    props.type === "AssetLink"
      ? props.data.target.fields.file.url
      : props.data.uri;
  // Link text has to be rendered itself as rich text
  // to account for various formatting options (e.g. bold text)
  // console.log(props.content)
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {/* <RichText document={{ content: props.content, nodeType: BLOCKS.DOCUMENT, data: {} }} /> */}
      {props.content.map((node: any) => {
        if (node.nodeType === "text") {
          return node.value;
        } else {
          return (
            <RichText
              document={{
                content: props.content,
                nodeType: BLOCKS.DOCUMENT,
                data: {},
              }}
            />
          );
        }
      })}
    </a>
  );
};
