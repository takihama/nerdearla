import { Box, Button, Link } from "@chakra-ui/react";

export const GetTicketsButton = () => (
  <Box textAlign="center">
    <Link
      href="https://registro.nerdear.la/?utm_source=navbar"
      target="_blank"
      isExternal
    >
      <Button
        mb={6}
        w={"350px"}
        borderRadius={100}
        bg="brand.nerdGreen"
        _hover={{ border: '2px' }}
        color="white"
        fontWeight={700}
        fontFamily="style.heading"
      >
        GET YOUR FREE TICKETS
      </Button>
    </Link>
  </Box>
);
