import React, { ReactElement, FunctionComponent } from "react";
import {
  theme,
  SplitLayoutContainer,
  FullScreenImage,
} from "@screencloud/alfie-alpha";
import { HeroRightContent } from "./HeroRightContent";
import { ContentfulHeroItem } from "../../../providers/ContentfulDataProvider";

interface Props {
  itemDurationSeconds: number;
  companyLogoUrl?: string;
  item: ContentfulHeroItem;
  progressBarColor?: string;
  themedColor?: string;
  isPortrait: boolean;
}

export const HeroLayout: FunctionComponent<Props> = (
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
      leftContentWidth={"30"}
      rightContentWidth={"70"}
      isPortrait={isPortrait}
      borderColor={themeColor}
      leftContent={
        <HeroRightContent
          itemDurationSeconds={itemDurationSeconds}
          item={item}
          companyLogoUrl={companyLogoUrl}
          progressBarColor={progressBarColor}
        />
      }
      rightContent={
        <FullScreenImage
          url={item.image?.url || ""}
          itemDurationSeconds={itemDurationSeconds}
        />
      }
    />
  );
};
