import { MaterialIcons } from "@expo/vector-icons";
import { bindActionCreators } from "@reduxjs/toolkit";
import {
  Button,
  HStack,
  IconButton,
  useToast,
  useColorModeValue,
} from "native-base";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../store";
import { State } from "../store/index";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";

type ShareLinkProps = {};

const ShareLink: React.FC<ShareLinkProps> = ({}) => {
  const { state } = useSelector((state: State) => state);

  const dispatch = useDispatch();
  const {} = bindActionCreators(actionCreators, dispatch);

  const toast = useToast();

  // color
  const groupInfoDrawerColors = useColorModeValue("emerald.200", "#36393f");
  const groupInfoFontColors = useColorModeValue("black", "white");

  const copyToClipboard = () => {
    if (state.currentGroup) {
      toast.show({ title: "Copied to Clipboard" });
      Clipboard.setString(
        `Use this Id to join ${state.currentGroup.name}: ${state.currentGroup.groupId}`
      );
    }
  };

  const sendInvite = async () => {
    if (state.currentGroup) {
      try {
        let msg = `Use this Id to join ${state.currentGroup.name}: ${state.currentGroup.groupId}`;
        const result = await Share.share({
          message: msg,
          title: "Share Link to group",
        });
      } catch (error) {
        console.log("Something went wrong sharing a message: ", error);
      }
    }
  };

  return (
    <HStack>
      <Button
        borderRightRadius="0"
        w="60%"
        backgroundColor={groupInfoDrawerColors}
        _text={{ color: groupInfoFontColors }}
        onPress={sendInvite}
      >
        Invite
      </Button>
      <IconButton
        w="20%"
        borderLeftColor="black"
        borderLeftWidth="1px"
        borderLeftRadius="0"
        variant="solid"
        backgroundColor={groupInfoDrawerColors}
        onPress={copyToClipboard}
        icon={
          <MaterialIcons
            name="content-copy"
            size={24}
            color={groupInfoFontColors}
          />
        }
      />
    </HStack>
  );
};
export default ShareLink;
