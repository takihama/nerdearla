import {
  Card,
  Center,
  ChakraProvider,
  Container,
  Divider,
  Flex,
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

const mapTalks = (talks) => {
  return talks.data.view.plannings.nodes;
};

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
    <Card>
      <Image src={bannerUrl} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={bannerUrl} onClick={onOpen} />
            <Flex alignItems={"center"}>
              <TimeIcon />
              <Text
                marginX={4}
                fontStyle="normal"
                fontSize="medium"
                fontWeight="semibold"
              >
                Inicia: {beginsAt.substring(11, 16)}
              </Text>

              <Text fontStyle="normal" fontSize="medium" fontWeight="semibold">
                Termina: {endsAt.substring(11, 16)}
              </Text>
            </Flex>
            <Flex alignItems={"center"}>
              <InfoOutlineIcon />
              <Text
                marginX={4}
                fontStyle="normal"
                fontSize="medium"
                fontWeight="semibold"
              >
                Sala: {type}
              </Text>
            </Flex>
            <Divider />
            <Divider />
            <Text fontSize="sm">{htmlDescription}</Text>
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
        const dateKey = curr.beginsAt.split("T")[0];

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
      <Container maxW="full" minH="100vh" bg="black" color="white">
        <NavBar onDateButtonClick={onDateButtonClick} />

        <HeaderBanner />

        {loading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Flex>
            {Object.keys(filteredTalks).map((type) => (
              <>
                <Stack key={type}>
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
              </>
            ))}
          </Flex>
        )}
      </Container>
    </ChakraProvider>
  );
};

export default App;
