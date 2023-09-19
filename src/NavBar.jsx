import { Button, Stack } from "@chakra-ui/react";
import { useState } from "react";

const buttons = [
  { name: "2023-09-26", label: "Tuesday 26" },
  { name: "2023-09-27", label: "Wednesday 27" },
  { name: "2023-09-28", label: "Thursday 28" },
  { name: "2023-09-29", label: "Friday 29" },
  { name: "2023-09-30", label: "Saturday 30" },
];

const NavBar = ({ onDateButtonClick }) => {
  const [selectedButton, setSelectedButton] = useState("2023-09-26");

  const onButtonClick = (date) => {
    setSelectedButton(date);
    onDateButtonClick(date);
  };

  return (
    <Stack direction="row" justifyContent={{base:"space-evenly", md: "space-between"}} flexWrap="wrap">
      {buttons.map((b) => (
        <Button
          key={b.name}
          size={{ base: "xs", md: "sm", lg: "md" }}
          name={b.name}
          onClick={() => onButtonClick(b.name)}
          colorScheme="orange"
          variant={selectedButton === b.name ? "solid" : "outline"}
        >
          {b.label}
        </Button>
      ))}
    </Stack>
  );
};

export default NavBar;
