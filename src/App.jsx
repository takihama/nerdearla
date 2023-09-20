import {
  Box,
  Center,
  ChakraProvider,
  Container,
  Grid,
  GridItem,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { HeaderBanner } from "./components/HeaderBanner";
import { NavBar } from "./components/NavBar";
import { TalkCard } from "./components/TalkCard";
import { TRACK_COLORS } from "./constants";
import { GetTicketsButton } from "./components/FreeTicketsButton";

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
  }));

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
      <Container
        maxW="full"
        minH="100vh"
        bg="black"
        color="white"
        py={4}
        px={{ base: 4, md: 7 }}
      >
        <GetTicketsButton />

        <NavBar onDateButtonClick={onDateButtonClick} />

        <HeaderBanner url="https://nerdear.la/" />

        {loading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Grid
            sx={{ overflowY: "auto" }}
            templateColumns={`repeat(${
              Object.keys(filteredTalks).length
            }, 1fr)`}
            gap={{ sm: 0.5, md: 2 }}
          >
            {Object.keys(filteredTalks)
              .sort()
              .map((type) => (
                <GridItem key={type} colSpan={1}>
                  <Stack
                    gap={{ base: 1, sm: 0.5, md: 2 }}
                    minW={{ base: 240, md: 0 }}
                    marginX={1}
                  >
                    <Box bg={TRACK_COLORS[type]} textAlign="center">
                      <Text color="white" fontWeight="medium">
                        {type}
                      </Text>
                    </Box>
                    <Stack
                      overflowY="scroll"
                      maxH={{ base: "90vh", md: "none" }}
                    >
                      {filteredTalks[type]
                        .sort((a, b) => (a.beginsAt >= b.beginsAt ? 1 : -1))
                        .map((talk) => (
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
