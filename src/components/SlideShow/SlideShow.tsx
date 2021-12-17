import { DEFAULT_ITEM_DELAY_SECONDS } from "@screencloud/alfie-alpha";
import React, { useMemo, useState } from "react";
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
  products: React.memo(ProductLayout),
  heroes: React.memo(HeroLayout),
} as const;

export const SlideShow = () => {
    // console.log(`SlideShow()`);
    const { data } = useContentfulData();
    const { appStarted } = useScreenCloudPlayer();

    const themedColor = "";
    const companyLogoUrl = data?.companyLogo;
    const isPortrait = false;
    const items = data?.items;
    
    /** All image urls of items[] (for preloading). */
    const imgSrcs = useMemo(() => (
      data?.assetFieldNames.reduce((keys, assetKey) => {
        if (!Array.isArray(items))
          return [];
        
        const itemImageFileNames = (items as any[]).reduce((collection, item) => {
          const fileName = item[assetKey]?.fileName;
          if (!fileName)
            return collection;
          
          const fileExt = String(fileName).toLowerCase().split(`.`).pop();
          if (!fileExt)
            return collection;
          
          if (fileExt && ['jpg', 'jpeg'].includes(fileExt)) {
            return [...collection, fileName];
          }
          return collection;
          
        }, [] as any[])
  
        return [...keys, ...itemImageFileNames];
        
        // Object.entries(items).reduce((itemImgSrcs, [itemKey, itemValue]) => (
        //   itemValue
        // ), [] as string[])
      }, [] as string [])
    ), [data?.assetFieldNames, items])

    /** preloading all imare sources */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const preloadedImages = useMemo(() => (
      imgSrcs?.map(src => {
        const image = new Image();
        image.src = src;
        return image;
      })
    ), [imgSrcs])

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

    const Comp = data?.templateName ? components[data.templateName] : undefined;
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
