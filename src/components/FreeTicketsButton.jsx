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
        colorScheme="blue"
        fontWeight={700}
        color="white"
      >
        GET YOUR FREE TICKETS
      </Button>
    </Link>
  </Box>
);
