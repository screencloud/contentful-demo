import React, { ReactElement, FunctionComponent, useState } from "react";
import { DEFAULT_ITEM_DELAY_SECONDS } from "@screencloud/alfie-alpha";
import useTimeout from "../../hooks/useTimeout";
import {
  useContentful,
} from "../../providers/ContentfulGraphqlDataProvider";
import { BlogPostLayout } from "../Layouts/BlogPostLayout/BlogPostLayout";
import { QuoteLayout } from "../Layouts/QuoteLayout/QuoteLayout";
import { HeroLayout } from "../Layouts/HeroLayout/HeroLayout";
import { ProductLayout } from "../Layouts/ProductLayout/ProductLayout";
import { useScreenCloudPlayer } from "../../providers/ScreenCloudPlayerProvider";

const components = {
  blog: BlogPostLayout,
  quotes: QuoteLayout,
  products: HeroLayout,
  heroes: ProductLayout,
} as const;

export const SlideShow: FunctionComponent<{}> =
  (props: {}): ReactElement<{}> => {
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

    const Comp = components[data.templateName];
    return (
      Comp ? (
        <Comp
          itemDurationSeconds={DEFAULT_ITEM_DELAY_SECONDS}
          item={data.items[currentItemIndex] as any}
          isPortrait={isPortrait}
          companyLogoUrl={companyLogoUrl}
          themedColor={themedColor}
        />
      )
      : <></>
    )
  };
