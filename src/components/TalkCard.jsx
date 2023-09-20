import {
  Card,
  Divider,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { InfoOutlineIcon, TimeIcon } from "@chakra-ui/icons";

export const TalkCard = ({
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
