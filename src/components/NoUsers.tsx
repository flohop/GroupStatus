import { Ionicons } from "@expo/vector-icons";
import { Center, HStack, Text, useColorModeValue } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import { Status } from "../shared/types";

type NoUsersProps = {
  shown: "all" | Status;
};

const NoUsers: React.FC<NoUsersProps> = ({ shown }) => {
  const rowBackground = useColorModeValue("white", "#2f3136"); // light, dark
  const rowTextColor = useColorModeValue("black", "white");

  return shown === "active" ? (
    <HStack space={0} alignItems="center" style={styles.container}>
      <Center
        w="40%"
        bg={rowBackground}
        size={16}
        width={100}
        _text={{
          color: { rowTextColor },
        }}
        shadow={3}
        roundedTopLeft="lg"
        roundedBottomLeft="lg"
      >
        <Text>No one is ready</Text>
      </Center>
      <Center
        size={16}
        w="20%"
        bg={rowBackground}
        roundedTopRight="lg"
        roundedBottomRight="lg"
        _text={{
          color: rowTextColor,
        }}
        shadow={3}
      >
        <Ionicons name="sad-sharp" size={32} color="black" />
      </Center>
    </HStack>
  ) : (
    <HStack space={0} alignItems="center" style={styles.container}>
      <Center
        w="40%"
        bg={rowBackground}
        size={16}
        width={100}
        _text={{
          color: rowTextColor,
        }}
        shadow={3}
        roundedTopLeft="lg"
        roundedBottomLeft="lg"
      >
        <Text>Everyone is ready</Text>
      </Center>
      <Center
        size={16}
        w="20%"
        bg={rowBackground}
        roundedTopRight="lg"
        roundedBottomRight="lg"
        _text={{
          color: rowTextColor,
        }}
        shadow={3}
      >
        <Ionicons name="happy-sharp" size={32} color="black" />
      </Center>
    </HStack>
  );
};
export default NoUsers;

const styles = StyleSheet.create({
  container: {
    shadowColor: "black",
    shadowOffset: { width: 10, height: 10 },
    shadowRadius: 20,
  },
});
