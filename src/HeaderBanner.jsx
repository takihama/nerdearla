import { Box, Image } from '@chakra-ui/react';

const HeaderBanner = () => {
    return (
      <Box
        bg="black"
        color="white"
        textAlign="center"
        py={8}
      >
        <Image
          src="https://nerdear.la/static/img/logos/nerdearla-detailed-no-bg.svg"
          alt="Nerdearla Banner"
          maxW="100%"
          maxHeight="100px"
          mx="auto"
        />
      </Box>
    );
  };

  export default HeaderBanner;
