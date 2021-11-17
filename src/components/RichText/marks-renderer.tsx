/* eslint-disable react/display-name */
import React, { ReactNode } from "react";
import { RenderMark } from "@contentful/rich-text-react-renderer";
import { Mark, MARKS, Text } from "@contentful/rich-text-types";

const defaultMarkRenderers: RenderMark = {
  [MARKS.BOLD]: (text) => <b>{text}</b>,
  [MARKS.ITALIC]: (text) => <i>{text}</i>,
  [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
  [MARKS.CODE]: (text) => <code>{text}</code>,
};

interface MarksRendererProps {
  node: Text;
}

const MarksRenderer: React.FC<MarksRendererProps> = (props) => {
  const { node } = props;

  return (
    <>
      {node.marks.reduce((value: ReactNode, mark: Mark): ReactNode => {
        if (defaultMarkRenderers[mark.type] === undefined) {
          return value;
        }

        return defaultMarkRenderers[mark.type](value);
      }, node.value)}
    </>
  );
};

export default MarksRenderer;
