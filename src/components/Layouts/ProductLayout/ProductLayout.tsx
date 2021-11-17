import React, { ReactElement, FunctionComponent } from "react";
import {
  theme,
  SplitLayoutContainer,
  FullScreenImage,
} from "@screencloud/alfie-alpha";
import { ProductRightContent } from "./ProductRightContent";
import { ContentfulProductItem } from "../../../providers/ContentfulGraphqlDataProvider";

interface Props {
  itemDurationSeconds: number;
  companyLogoUrl?: string;
  item: ContentfulProductItem;
  progressBarColor?: string;
  themedColor?: string;
  isPortrait: boolean;
}

export const ProductLayout: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
  const {
    itemDurationSeconds,
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
          url={item.productImage.url}
          itemDurationSeconds={itemDurationSeconds}
        />
      }
      rightContent={
        <ProductRightContent
          itemDurationSeconds={itemDurationSeconds}
          item={item}
          progressBarColor={progressBarColor}
        />
      }
    />
  );
};
