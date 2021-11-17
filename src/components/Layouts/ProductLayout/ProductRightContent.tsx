import React, {
  ReactElement,
  FunctionComponent,
  useState,
  useEffect,
} from "react";
import {
  ContentWrapper,
  Flex,
  theme,
  Text,
  TextSizes,
  Box,
  Progress,
  QRCode,
} from "@screencloud/alfie-alpha";
import { ContentfulProductItem } from "../../../providers/ContentfulGraphqlDataProvider";
import { RichText } from "../../RichText/rich-text";

interface Props {
  itemDurationSeconds: number;
  item: ContentfulProductItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

export const ProductRightContent: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
  const { itemDurationSeconds, item, progressBarColor } = props;

  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setKey(Date.now());
  }, [item]);

  return (
    <ContentWrapper backgroundColor={theme.colors.white} key={key}>
      <Flex
        overflow="hidden"
        flexDirection="column"
        justifyContent="center"
        height="100%"
      >
        <Flex
          overflow="hidden"
          flexDirection="row"
          justifyContent="left"
          width="100%"
        >
          <Text
            type={TextSizes.H4}
            color={theme.colors.black}
            wordBreak="break-word"
            fontFamily={"sans-serif"}
            fontWeight={theme.fontWeights.black}
            paddingBottom={{ _: 4, lg: 7 }}
          >
            {item.productName}
          </Text>
        </Flex>
        <Flex
          overflow="hidden"
          flexDirection="row"
          justifyContent="left"
          width="100%"
        >
          <Text
            type={TextSizes.H4}
            color={theme.colors.black}
            wordBreak="break-word"
            fontFamily={"sans-serif"}
            fontWeight={theme.fontWeights.black}
            paddingBottom={{ _: 4, lg: 7 }}
          >
            <RichText document={item.productCategory.json} />
          </Text>
        </Flex>
        <Flex
          flexGrow={1}
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          <Text
            type={TextSizes.SmallP}
            wordBreak="break-word"
            fontFamily={"sans-serif"}
            paddingBottom={{ _: 4, lg: 7 }}
          >
            {item.price}
          </Text>
        </Flex>
      </Flex>
    </ContentWrapper>
  );
};
