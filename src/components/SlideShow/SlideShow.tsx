import React, { ReactElement, FunctionComponent, useState } from "react";
import { DEFAULT_ITEM_DELAY_SECONDS } from "@screencloud/alfie-alpha";
import useTimeout from "../../hooks/useTimeout";
import {
  Blog,
  Products,
  Quotes,
  useContentful,
} from "../../providers/ContentfulGraphqlDataProvider";
import { useScreenCloudPlayer } from "../../providers/ScreenCloudPlayerProvider";
import { BlogPostLayout } from "../Layouts/BlogPostLayout/BlogPostLayout";
import { QuoteLayout } from "../Layouts/QuoteLayout/QuoteLayout";
import { ProductLayout } from "../Layouts/ProductLayout/ProductLayout";

interface Props {}

export const SlideShow: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const { data } = useContentful();

  const { appStarted } = useScreenCloudPlayer();

  const themedColor = "";
  const companyLogoUrl = "";
  const isPortrait = false;

  // Loop over each item in feed, once all items have been displayed loop back to the start
  useTimeout(
    () => {
      if (data) {
        if (currentItemIndex === data?.items.length - 1) {
          setCurrentItemIndex(0);
        } else {
          setCurrentItemIndex(currentItemIndex + 1);
        }
      }
    },
    DEFAULT_ITEM_DELAY_SECONDS * 1000,
    data && data?.items.length > 0 && appStarted
  );

  if (!data || data.items.length === 0) {
    return <></>;
  }

  switch (data.type) {
    case Blog:
      return (
        <BlogPostLayout
          itemDurationSeconds={DEFAULT_ITEM_DELAY_SECONDS}
          item={data.items[currentItemIndex]}
          isPortrait={isPortrait}
          companyLogoUrl={companyLogoUrl}
          themedColor={themedColor}
        />
      );
    case Quotes:
      return (
        <QuoteLayout
          itemDurationSeconds={DEFAULT_ITEM_DELAY_SECONDS}
          item={data.items[currentItemIndex]}
          isPortrait={isPortrait}
          companyLogoUrl={companyLogoUrl}
          themedColor={themedColor}
        />
      );
    case Products:
      return (
        <ProductLayout
          itemDurationSeconds={DEFAULT_ITEM_DELAY_SECONDS}
          item={data.items[currentItemIndex]}
          isPortrait={isPortrait}
          companyLogoUrl={companyLogoUrl}
          themedColor={themedColor}
        />
      );
    default:
      return <></>;
  }
};
