import { DEFAULT_ITEM_DELAY_SECONDS } from "@screencloud/alfie-alpha";
import React, { useState } from "react";
import useTimeout from "../../hooks/useTimeout";
import {
  useContentfulData
} from "../../providers/ContentfulDataProvider";
import { useScreenCloudPlayer } from "../../providers/ScreenCloudPlayerProvider";
import { BlogPostLayout } from "../Layouts/BlogPostLayout/BlogPostLayout";
import { HeroLayout } from "../Layouts/HeroLayout/HeroLayout";
import { ProductLayout } from "../Layouts/ProductLayout/ProductLayout";
import { QuoteLayout } from "../Layouts/QuoteLayout/QuoteLayout";

const ITEM_DELAY_SECONDS = DEFAULT_ITEM_DELAY_SECONDS;

/** Maps TemplateNames to the corresponding render component. */
const components = {
  blog: React.memo(BlogPostLayout),
  quotes: React.memo(QuoteLayout),
  products: React.memo(HeroLayout),
  heroes: React.memo(ProductLayout),
} as const;

export const SlideShow = () => {
    const { data } = useContentfulData();
    const { appStarted } = useScreenCloudPlayer();

    const themedColor = "";
    const companyLogoUrl = data?.companyLogo;
    const isPortrait = false;
    const items = data?.items;

    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    // Loop over each item in feed, once all items have been displayed loop back to the start
    useTimeout(
      () => {
        if (items) {
          if (currentItemIndex === items.length - 1) {
            setCurrentItemIndex(0);
          } else {
            setCurrentItemIndex(currentItemIndex + 1);
          }
        }
      },
      ITEM_DELAY_SECONDS * 1000,
      !!items?.length && appStarted
    );

    const Comp = data ? components[data.templateName] : undefined;
    const item = items?.[currentItemIndex];
    
    return (
      item && Comp ? (
        <Comp
          itemDurationSeconds={ITEM_DELAY_SECONDS}
          item={item as any}
          isPortrait={isPortrait}
          companyLogoUrl={companyLogoUrl}
          themedColor={themedColor}
        />
      )
      : <></>
    )
  };
