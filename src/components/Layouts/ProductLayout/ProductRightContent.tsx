import React, {
  ReactElement,
  FunctionComponent,
  useState,
  useEffect,
} from "react";
import {
  Box,
  ContentWrapper,
  Flex,
  theme,
  Text,
  TextSizes,
} from "@screencloud/alfie-alpha";
import { ContentfulProductItem } from "../../../providers/ContentfulDataProvider";

interface Props {
  itemDurationSeconds: number;
  item: ContentfulProductItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

export const ProductRightContent: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
  const { item } = props;

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
          flexGrow={1}
          overflow="hidden"
          flexDirection="row"
          justifyContent="left"
          width="100%"
        >
          <Text
            type={TextSizes.H3}
            color={theme.colors.black}
            wordBreak="break-word"
            fontFamily={theme.fonts.normal}
            fontWeight={theme.fontWeights.bold}
          >
            {item.brand}
          </Text>
        </Flex>

        <Flex
          overflow="hidden"
          flexDirection="row"
          justifyContent="left"
          width="100%"
        >
          <Text
            type={TextSizes.H1}
            color="#2d313b"
            wordBreak="break-word"
            fontFamily={theme.fonts.normal}
            fontWeight={theme.fontWeights.bold}
          >
            {item.name.toUpperCase()}
          </Text>
        </Flex>

        <Flex
          overflow="hidden"
          flexDirection="row"
          justifyContent="left"
          width="100%"
          paddingBottom={{ _: 4, lg: 7 }}
        >
          <Box marginRight={{ _: 2 }}>
            <Text
              type={TextSizes.SmallP}
              color="#777"
              wordBreak="break-word"
              fontFamily={theme.fonts.normal}
              fontWeight={theme.fontWeights.normal}
              paddingBottom={{ _: 4, lg: 7 }}
            >
              {item.type}
            </Text>
          </Box>
          <Text
            type={TextSizes.SmallP}
            color="#777"
            wordBreak="break-word"
            fontFamily={theme.fonts.normal}
            fontWeight={theme.fontWeights.normal}
            paddingBottom={{ _: 4, lg: 7 }}
          >
            {item.id}
          </Text>
        </Flex>

        <Flex
          flexGrow={1}
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="left"
          alignItems="start"
        >
          <Flex
            flexDirection="column"
            flexWrap="wrap"
            justifyContent="left"
            alignItems="start"
          >
            <Text
              type={TextSizes.H1}
              wordBreak="break-word"
              fontFamily={theme.fonts.normal}
              fontWeight={theme.fontWeights.bold}
              color="#2d313b"
            >
              £{item.price}
            </Text>
            {item.comparePrice > item.price && (
              <Text
                type={TextSizes.P}
                wordBreak="break-word"
                color="#777"
                fontFamily={theme.fonts.normal}
                fontWeight={theme.fontWeights.normal}
              >
                was £{item.comparePrice}
              </Text>
            )}
          </Flex>

          {item.comparePrice > item.price && (
            <Flex
              bg="#ffd900"
              borderRadius="100%"
              minWidth="175px"
              minHeight="175px"
              justifyContent="center"
              alignItems="center"
              marginLeft={{ _: 2 }}
            >
              <Text
                type={TextSizes.H4}
                fontFamily={theme.fonts.normal}
                textAlign="center"
              >
                save
                <br />£{item.comparePrice - item.price}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </ContentWrapper>
  );
};
