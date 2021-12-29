import { MaterialIcons } from "@expo/vector-icons";
import { HStack, Switch, useColorMode } from "native-base";
import React, { useState } from "react";

const DARK_ICON_NAME = "nightlight-round";
const LIGHT_ICON_NAME = "wb-sunny";

type ThemeToggleProps = {};

const ThemeToggle: React.FC<ThemeToggleProps> = ({}) => {
  const { colorMode, setColorMode } = useColorMode();

  const [iconName, setIconName] = useState<
    typeof DARK_ICON_NAME | typeof LIGHT_ICON_NAME
  >(colorMode === "light" ? LIGHT_ICON_NAME : DARK_ICON_NAME);

  const [iconColor, setIconColor] = useState<string>();

  const toggleHandler = () => {
    if (colorMode === "light") {
      setColorMode("dark");
      setIconName(DARK_ICON_NAME);
      setIconColor("#0c4a6e");
    } else {
      setColorMode("light");
      setIconName(LIGHT_ICON_NAME);
      setIconColor("yellow");
    }
  };

  return (
    <HStack alignItems="center" space={8}>
      <MaterialIcons name={iconName} size={24} color={iconColor} />
      <Switch
        size="lg"
        offTrackColor="yellow.200"
        offThumbColor="yellow.400"
        onTrackColor="lightBlue.700"
        onThumbColor="lightBlue.900"
        onChange={toggleHandler}
        defaultIsChecked={colorMode === "dark"}
      />
    </HStack>
  );
};
export default ThemeToggle;
