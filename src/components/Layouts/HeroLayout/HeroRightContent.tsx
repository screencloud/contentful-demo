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
  QRCode,
  Logo,
} from "@screencloud/alfie-alpha";
import { ContentfulHeroItem } from "../../../providers/ContentfulGraphqlDataProvider";

interface Props {
  itemDurationSeconds: number;
  item: ContentfulHeroItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

export const HeroRightContent: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
  const { item, companyLogoUrl } = props;

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
          {companyLogoUrl && (
            <Logo url={companyLogoUrl} maxHeight={"160px"} maxWidth={"200px"} />
          )}
        </Flex>
        <Text
          type={TextSizes.H4}
          color={theme.colors.black}
          wordBreak="break-word"
          fontFamily={"sans-serif"}
          fontWeight={theme.fontWeights.black}
          paddingBottom={{ _: 4, lg: 7 }}
        >
          {item.headline}
        </Text>
        {item.link && (
          <Flex
            width={"100%"}
            justifyContent={"center"}
            alignItems={"flex-end"}
            flexDirection="row"
          >
            <QRCode url={item.link} />
          </Flex>
        )}
      </Flex>
    </ContentWrapper>
  );
};
