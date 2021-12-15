import React, { ReactElement, FunctionComponent } from "react";
import {
  theme,
  SplitLayoutContainer,
  FullScreenImage,
} from "@screencloud/alfie-alpha";
import { QuoteRightContent } from "./QuoteRightContent";
import { ContentfulQuoteItem } from "../../../providers/ContentfulDataProvider";

interface Props {
  itemDurationSeconds: number;
  companyLogoUrl?: string;
  item: ContentfulQuoteItem;
  progressBarColor?: string;
  themedColor?: string;
  isPortrait: boolean;
}

export const QuoteLayout: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
  const {
    itemDurationSeconds,
    companyLogoUrl,
    item,
    progressBarColor,
    isPortrait,
    themedColor,
  } = props;

  const themeColor = themedColor || theme.colors.gray;

  return (
    <SplitLayoutContainer
      leftContentWidth={"50"}
      rightContentWidth={"50"}
      isPortrait={isPortrait}
      borderColor={themeColor}
      leftContent={
        <FullScreenImage
          url={item.image?.url ? `${item.image?.url}?w=2048` : ""}
          itemDurationSeconds={itemDurationSeconds}
        />
      }
      rightContent={
        <QuoteRightContent
          itemDurationSeconds={itemDurationSeconds}
          item={item}
          companyLogoUrl={companyLogoUrl}
          progressBarColor={progressBarColor}
        />
      }
    />
  );
};
