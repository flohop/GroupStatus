import { bindActionCreators } from "@reduxjs/toolkit";
import {
  Box,
  Button,
  Center,
  Heading,
  useColorModeValue,
  VStack,
} from "native-base";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CurrentUserContext } from "../shared/types";
import { actionCreators } from "../store";
import { leaveGroup } from "../store/action-creators";
import { State } from "../store/index";
import { leaveGroupFirebase } from "../util/group/leaveGroup";
import { currentUserContext } from "./auth/CurrentUserProvider";
import ShareLink from "./ShareLink";

type DrawerGroupInfoProps = {};

const DrawerGroupInfo: React.FC<DrawerGroupInfoProps> = ({}) => {
  const { state } = useSelector((state: State) => state);

  const { user } = useContext(currentUserContext) as CurrentUserContext;

  const dispatch = useDispatch();
  const {} = bindActionCreators(actionCreators, dispatch);

  // colors
  const groupInfoDrawerColors = useColorModeValue("white", "#2f3136");

  const leaveGroupHandler = async () => {
    if (state.currentGroup !== undefined && user) {
      await leaveGroupFirebase(state.currentGroup, user).then(() => {
        dispatch(leaveGroup(state.currentGroup!));
      });
    }
  };

  return (
    <Box flex={1} borderRadius="10" backgroundColor={groupInfoDrawerColors}>
      {state.currentGroup ? (
        <>
          <VStack space={4} alignItems="center">
            <Heading mt={1}>{state.currentGroup.name}</Heading>
            <Center>
              <ShareLink />
            </Center>
          </VStack>

          <Box flex={1} alignItems="center">
            <Box flex={1} justifyContent="center">
              <Heading size="md" opacity="0.5">
                More coming soon
              </Heading>
            </Box>
            <Center position="absolute" bottom="0" mb={5}>
              <Button
                variant="outline"
                colorScheme="danger"
                mb="0"
                onPress={leaveGroupHandler}
              >
                Leave Group
              </Button>
            </Center>
          </Box>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};
export default DrawerGroupInfo;
