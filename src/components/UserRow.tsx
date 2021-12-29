import { Feather } from "@expo/vector-icons";
import { Center, HStack, Image, Text, useColorModeValue } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import { Member } from "../shared/types";

type UserRowProps = {
  member: Member;
};

const UserRow: React.FC<UserRowProps> = ({ member }) => {
  const rowBackground = useColorModeValue("white", "#2f3136"); // light, dark
  const rowTextColor = useColorModeValue("black", "white");

  return (
    <HStack space={0} alignItems="center" style={styles.container}>
      <Center
        size={16}
        w="30%"
        roundedBottomLeft="md"
        roundedTopLeft="md"
        bg={rowBackground}
        _text={{
          color: { rowTextColor },
        }}
        shadow={3}
      >
        <Image
          source={{
            uri: member.photoUrl,
          }}
          fallbackSource={{
            uri: "https://www.w3schools.com/css/img_lights.jpg",
          }}
          alt="User Profile"
          size="xs"
          rounded="100px"
        />
      </Center>
      <Center
        w="40%"
        bg={rowBackground}
        size={16}
        width={100}
        _text={{
          color: rowTextColor,
        }}
        shadow={3}
      >
        <Text>{member.name}</Text>
      </Center>
      <Center
        size={16}
        w="20%"
        bg={rowBackground}
        _text={{
          color: rowTextColor,
        }}
        roundedTopRight="lg"
        roundedBottomRight="lg"
        shadow={3}
      >
        {member.status === "active" ? (
          <Feather name="check-circle" size={32} color="green" />
        ) : (
          <Feather name="x-circle" size={32} color="red" />
        )}
      </Center>
    </HStack>
  );
};
export default UserRow;

const styles = StyleSheet.create({
  container: {
    shadowColor: "black",
    shadowOffset: { width: 10, height: 10 },
    shadowRadius: 20,
  },
});
