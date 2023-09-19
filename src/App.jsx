import {
  Box,
  Card,
  Center,
  ChakraProvider,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { InfoOutlineIcon, TimeIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import HeaderBanner from "./HeaderBanner";
import NavBar from "./NavBar";
import { TRACK_COLORS } from "./constants";

const getTalks = async () =>
  axios.post("https://api.swapcard.com/graphql", {
    operationName: "PlanningListViewConnectionQuery",
    variables: {
      eventId: "RXZlbnRfMTQ3MjE2MA==",
      withEvent: true,
      viewId: "RXZlbnRWaWV3XzYwMjEwNg==",
      timezone: "America/Buenos_Aires",
      after: null,
      first: 200,
    },
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash:
          "451a05a3182a71b2515b9a3a22ef77641537ed87e2c07fe8af33f862e5cb6aea",
      },
    },
  });

const mapTalks = (talks) =>
  talks.data.view.plannings.nodes.map((t) => ({
    ...t,
    date: t.beginsAt.split("T")[0],
    beginsAt: t.beginsAt.substring(11, 16),
    endsAt: t.endsAt.substring(11, 16),
    durationInMin:
      (t.endsAt.substring(11, 13) - t.beginsAt.substring(11, 13)) * 60 +
      (t.endsAt.substring(14, 16) - t.beginsAt.substring(11, 13)),
  }));

const TalkCard = ({
  beginsAt,
  endsAt,
  bannerUrl,
  title,
  htmlDescription,
  type,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Card
      _hover={{
        cursor: "pointer",
        transform: "scale(1.01)",
        transition: "all .2s",
      }}
    >
      <Image src={bannerUrl} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW={{ sm: "0px", md: "680px" }}>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={bannerUrl} onClick={onOpen} />
            <Flex
              flexDirection={{ sm: "column", md: "row" }}
              justifyContent={"space-evenly"}
              padding={4}
            >
              <Flex alignItems={"center"}>
                <TimeIcon />
                <Text
                  marginX={2}
                  fontStyle="normal"
                  fontSize="medium"
                  fontWeight="semibold"
                >
                  {beginsAt}
                </Text>
                <Text>-</Text>
                <Text
                  fontStyle="normal"
                  fontSize="medium"
                  fontWeight="semibold"
                  marginX={2}
                >
                  {endsAt}
                </Text>
              </Flex>
              <Flex alignItems={"center"}>
                <InfoOutlineIcon />
                <Text
                  marginX={2}
                  fontStyle="normal"
                  fontSize="medium"
                  fontWeight="semibold"
                >
                  Sala: {type}
                </Text>
              </Flex>
            </Flex>
            <Divider />
            <Divider />
            <Text fontSize="sm" padding={2}>
              {htmlDescription}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
};

const App = () => {
  const [talks, setTalks] = useState([]);
  const [filteredTalks, setFilteredTalks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTalks().then((response) => {
      const mappedTalks = mapTalks(response.data);
      const groupedTalks = mappedTalks.reduce((acc, curr) => {
        const dateKey = curr.date;

        acc[dateKey] = acc[dateKey] || {};

        (acc[dateKey][curr.place.split(" ")[0]] =
          acc[dateKey][curr.place.split(" ")[0]] || []).push(curr);

        return acc;
      }, {});
      setTalks(groupedTalks);
      setFilteredTalks(groupedTalks["2023-09-26"]);
      setLoading(false);
    });
  }, []);

  const onDateButtonClick = (date) => {
    setFilteredTalks(talks[date]);
  };

  return (
    <ChakraProvider>
      <Container maxW="full" minH="100vh" bg="black" color="white" pt={9} px={{base: 4, md: 7}}>
        <NavBar onDateButtonClick={onDateButtonClick} />

        <HeaderBanner />

        {loading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Grid
            sx={{overflowY: "auto"}}
            templateColumns={`repeat(${
              Object.keys(filteredTalks).length
            }, 1fr)`}
            gap={{ sm: 0.5, md: 2 }}
          >
            {Object.keys(filteredTalks).map((type) => (
              <GridItem key={type} colSpan={1}>
                <Stack gap={{ base: 1,sm: 0.5, md: 2 }} minW={240} marginX={1}>
                  <Box bg={TRACK_COLORS[type]} textAlign="center">
                    <Text color="white" fontWeight="medium">{type}</Text>
                  </Box>
                  {filteredTalks[type].map((talk) => (
                    <TalkCard
                      key={talk.id}
                      beginsAt={talk.beginsAt}
                      endsAt={talk.endsAt}
                      title={talk.title}
                      bannerUrl={talk.bannerUrl}
                      htmlDescription={talk.htmlDescription}
                      type={talk.type}
                    />
                  ))}
                </Stack>
              </GridItem>
            ))}
          </Grid>
        )}
      </Container>
    </ChakraProvider>
  );
};

export default App;
