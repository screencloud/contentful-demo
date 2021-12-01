import {
  Box, ContentWrapper,
  Flex, Progress,
  QRCode, Text,
  TextSizes, theme
} from "@screencloud/alfie-alpha";
import differenceInDays from "date-fns/differenceInDays";
import differenceInHours from "date-fns/differenceInHours";
import differenceInMinutes from "date-fns/differenceInMinutes";
import differenceInSeconds from "date-fns/differenceInSeconds";
import format from "date-fns/format";
import React, {
  FunctionComponent, useEffect, useState
} from "react";
import { ContentfulBlogItem } from "../../../providers/ContentfulDataProvider";
import { RichText } from "../../RichText/rich-text";

interface Props {
  itemDurationSeconds: number;
  item: ContentfulBlogItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

const getPublishedTime = (publishedDate: string): string => {
  const now = new Date();
  const published = new Date(publishedDate);
  const differenceDays = differenceInDays(now, published);
  if (differenceDays < 0) {
    const differenceHours = differenceInHours(now, published);
    if (differenceHours < 0) {
      const differenceMinutes = differenceInMinutes(now, published);
      if (differenceMinutes < 0) {
        const differenceSeconds = differenceInSeconds(now, published);
        return `${differenceSeconds} seconds ago`;
      }
      return `${differenceMinutes} minutes ago`;
    }
    return `${differenceHours} hours ago`;
  }
  if (differenceDays > 30) {
    return format(published, "yyyy-MM-dd");
  }
  return `${differenceDays} days ago`;
};

export const BlogPostRightContent: FunctionComponent<Props> = props => {
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
            {item.title}
          </Text>
        </Flex>
        {item.pubDate && (
          <Flex
            overflow="hidden"
            flexDirection="row"
            justifyContent="right"
            width="100%"
          >
            <Text
              type={TextSizes.Label}
              color={theme.colors.black}
              wordBreak="break-word"
              fontFamily={"sans-serif"}
              fontWeight={theme.fontWeights.black}
              paddingBottom={{ _: 4, lg: 7 }}
            >
              {getPublishedTime(item.pubDate)}
            </Text>
          </Flex>
        )}
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
            <RichText document={item.description.json} />
          </Text>
        </Flex>
        <Flex
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
          flexDirection="row"
        >
          <Box width={"33%"}>
            <Progress
              duration={itemDurationSeconds}
              barColor={progressBarColor}
            />
          </Box>
          <QRCode url={item.link} />
        </Flex>
      </Flex>
    </ContentWrapper>
  );
};
