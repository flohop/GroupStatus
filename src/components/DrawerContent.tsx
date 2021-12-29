import { MaterialIcons } from "@expo/vector-icons";
import { bindActionCreators } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import {
  Alert,
  AlertDialog,
  Avatar,
  Button,
  CloseIcon,
  Collapse,
  IconButton,
  Input,
  Pressable,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  View,
} from "native-base";
// @ts-ignore
import randomColor from "random-color";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Group } from "../shared/types";
import { actionCreators, State } from "../store";
import {
  createGroup,
  joinGroup,
  setCurrentGroup,
} from "../store/action-creators";
import { createGroupFirestore } from "../util/group/createGroup";
import { currentUserContext } from "./auth/CurrentUserProvider";
import DrawerGroupInfo from "./DrawerGroupInfo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { joinGroupFirebase } from "../util/group/joinGroup";
import { getGroupFromFirestore } from "../util/group/getGroup";

type DrawerContentProps = {};

const color = randomColor();

const DrawerContent = (props: any) => {
  const { user } = useContext(currentUserContext);
  const dispatch = useDispatch();
  const { state } = useSelector((state: State) => state);

  const {} = bindActionCreators(actionCreators, dispatch);

  const cancelRef = React.useRef();
  const [groupName, setGroupName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [createDialogIsOpen, setCreateDialogIsOpen] = useState(false);

  const [groupId, setGroupId] = React.useState("");
  const [joinDialogIsOpen, setJoinDialogIsOpen] = useState(false);
  const [joinGroupIsLoading, setJoinGroupIsLoading] = useState(false);
  const [showGroupIdError, setShowGroupIdError] = useState(false);

  // colors
  const iconDrawerColors = useColorModeValue("white", "#202225"); // light, dark
  const iconBackgroundColor = useColorModeValue(color.hexString(), "#3b3e41"); // light, dark
  const iconTextColor = useColorModeValue("black", "white"); // light, dark

  const onCloseCreate = () => {
    setCreateDialogIsOpen(false);
  };

  const onCloseJoin = () => {
    setJoinDialogIsOpen(false);
  };

  const createGroupHandler = () => {
    if (user) {
      setIsLoading(true);
      const newGroup = createGroupFirestore(groupName, user);
      // TODO: check if the returned group works with my Redux Store
      dispatch(createGroup(newGroup));
      dispatch(setCurrentGroup(newGroup.groupId));
      setIsLoading(false);
      setGroupName("");
      setCreateDialogIsOpen(false);
    } else {
      console.log("Please login to create a group");
    }
  };

  const joinGroupHandler = () => {
    setJoinGroupIsLoading(true);
    console.log("handle join");

    if (user) {
      console.log("Got here");

      setGroupId("");
      // join group with firestore and then in redux
      joinGroupFirebase(groupId, {
        expoPushToken: user.expoPushToken,
        name: user.displayName,
        isAdmin: false,
        status: "inactive",
        uid: user.uid,
        photoUrl: user.photoUrl,
      })
        .then(() => {
          console.log("Joined group in firestore");

          getGroupFromFirestore(groupId).then((res) => {
            if (res) {
              // add group to redux
              dispatch(joinGroup(res));
              setJoinGroupIsLoading(false);
              setJoinDialogIsOpen(false);
            }
          });
        })
        .catch((err) => {
          console.log("Error: ", err);
          setShowGroupIdError(true);
        });
    }
    setJoinGroupIsLoading(false);
  };

  const allReady = (group: Group): boolean => {
    // returns true, if everyone in a group is ready
    if (group.members) {
      let allReady = true;
      group.members.forEach((mem) => {
        if (mem.status === "inactive") {
          allReady = false;
        }
      });
      return allReady;
    }
    return false;
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight,
        flexDirection: "row",
        backgroundColor: iconDrawerColors,
      }}
    >
      {/* This section is for the group icons */}
      <View
        style={{
          flex: 1,
          borderColor: "black",
          borderRightWidth: 1,
          flexDirection: "column-reverse",
          backgroundColor: iconDrawerColors,
        }}
      >
        <Stack
          direction={{
            base: "column",
            md: "column",
          }}
          space={1}
          alignItems={{
            base: "center",
            md: "center",
          }}
        >
          {state.pending ? (
            <Text>...</Text>
          ) : (
            state.groups.map((group) => {
              if (group?.name) {
                return (
                  <Pressable
                    key={group.groupId}
                    onPress={() => {
                      dispatch(setCurrentGroup(group.groupId));
                      props.navigation.closeDrawer();
                    }}
                  >
                    <Avatar
                      my={2}
                      source={{
                        uri:
                          group.iconUrl ||
                          "https://pbs.twimg.com/profile_images/1188747996843761665/8CiUdKZW_400x400.jpg",
                      }}
                      style={{
                        backgroundColor: iconBackgroundColor,
                        //color: iconTextColor,
                      }}
                    >
                      {group.name ? group.name.substring(0, 2) : ""}
                      {allReady(group) ? (
                        <Avatar.Badge bg={"green.400"} />
                      ) : (
                        <Avatar.Badge bg={"red.400"} />
                      )}
                    </Avatar>
                  </Pressable>
                );
              }
            })
          )}

          <IconButton
            borderRadius="100"
            variant="solid"
            colorScheme="emerald"
            icon={<MaterialIcons name="add" size={32} color="black" />}
            onPress={() => setCreateDialogIsOpen(true)}
          />

          <IconButton
            borderRadius="100"
            variant="solid"
            colorScheme="emerald"
            icon={<Ionicons name="enter-outline" size={32} color="black" />}
            onPress={() => setJoinDialogIsOpen(true)}
          />

          {/* The dialog to join a group */}
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={joinDialogIsOpen}
            onClose={onCloseJoin}
          >
            <AlertDialog.Content>
              <AlertDialog.Header>Join Group</AlertDialog.Header>
              <AlertDialog.Body>
                <Stack space={4} w="100%">
                  <Input
                    size="md"
                    placeholder="Group Id"
                    value={groupId}
                    onChangeText={(e: string) => {
                      const newString = e
                        .substring(e.indexOf(":") + 1)
                        .replace(/ /g, "");
                      setGroupId(newString);
                    }}
                  />
                </Stack>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                {!isLoading ? (
                  <>
                    <Button onPress={onCloseJoin} colorScheme="red">
                      Cancel
                    </Button>
                    <Button
                      isLoading={joinGroupIsLoading}
                      colorScheme="emerald"
                      onPress={joinGroupHandler}
                      ml={3}
                      isDisabled={groupId.length < 8}
                    >
                      Join
                    </Button>
                  </>
                ) : (
                  <>
                    <Spinner />
                  </>
                )}
              </AlertDialog.Footer>

              <Collapse isOpen={showGroupIdError}>
                <Alert
                  status="error"
                  action={
                    <IconButton
                      icon={<CloseIcon size="xs" />}
                      onPress={() => setShowGroupIdError(false)}
                    />
                  }
                  actionProps={{
                    alignSelf: "center",
                  }}
                >
                  <Alert.Icon />
                  <Alert.Title>Error</Alert.Title>
                  <Alert.Description>
                    Group with that id does not exist
                  </Alert.Description>
                </Alert>
              </Collapse>
            </AlertDialog.Content>
          </AlertDialog>

          {/* The dialog to create a group */}
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={createDialogIsOpen}
            onClose={onCloseCreate}
          >
            <AlertDialog.Content>
              <AlertDialog.Header>Create Group</AlertDialog.Header>
              <AlertDialog.Body>
                <Stack space={4} w="100%">
                  <Input
                    size="md"
                    placeholder="Group Name"
                    value={groupName}
                    onChangeText={(e: string) => setGroupName(e)}
                  />
                </Stack>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                {!isLoading ? (
                  <>
                    <Button onPress={onCloseCreate} colorScheme="red">
                      Cancel
                    </Button>
                    <Button
                      colorScheme="emerald"
                      onPress={createGroupHandler}
                      ml={3}
                      isDisabled={groupName.length === 0}
                    >
                      Create
                    </Button>
                  </>
                ) : (
                  <>
                    <Spinner />
                  </>
                )}
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        </Stack>
      </View>
      {/* This section is for the current group info */}
      <View style={{ flex: 4 }}>
        <DrawerGroupInfo />
      </View>
    </View>
  );
};
export default DrawerContent;
