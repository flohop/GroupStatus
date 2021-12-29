import { MaterialCommunityIcons } from "@expo/vector-icons";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as Notifications from "expo-notifications";
import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Spinner,
  Text,
  useColorModeValue,
} from "native-base";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CurrentUserContext, Status } from "../shared/types";
import { actionCreators, State } from "../store";
import {
  setCurrentGroup,
  setCurrentStatus,
  setPending,
} from "../store/action-creators";
import { changeStatusInFirebase } from "../util/group/changeStatus";
import { sendNotifications } from "../util/group/sendNotifications";
import { currentUserContext } from "./auth/CurrentUserProvider";
import UserTable from "./UserTable";

type GroupContentProps = {};

// notification settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const GroupContent: React.FC<GroupContentProps> = ({}) => {
  const { user } = useContext(currentUserContext) as CurrentUserContext;

  const [linkData, setLinkData] = useState<any>(null);

  const dispatch = useDispatch();
  const { state } = useSelector((state: State) => state);
  const {} = bindActionCreators(actionCreators, dispatch);

  const [updatingStatus, setUpdatingStatus] = useState(true);

  const [userStatus, setUserStatus] = useState<Status>();

  // notifications

  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // colors
  const backgroundColor = useColorModeValue("white", "#40444b"); // light, dark

  const sendNotificationHandler = async () => {
    if (state.currentGroup?.everyoneIsReady) {
      await sendNotifications(state.currentGroup);
    }
  };

  useEffect(() => {
    console.log("Changed something");

    let unmounted = false;
    if (!unmounted && state.currentGroup?.everyoneIsReady) {
      console.log("Sending notification here");

      sendNotificationHandler();
    }

    return () => {
      unmounted = true;
    };
  }, [state.currentGroup?.everyoneIsReady]);

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    // @ts-ignore
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification.request.content.data.someData);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // @ts-ignore
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // setCurrentGroup(
        //   String(response.notification.request.content.data.groupId)
        // );

        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        // @ts-ignore
        notificationListener.current
      );
      // @ts-ignore
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (linkData !== undefined && linkData !== null && user !== undefined) {
      if (linkData.groupId) {
        // if the user is already in the group, just set it to current
        dispatch(setPending(true));
        dispatch(setCurrentGroup(linkData.groupId));

        // if the current group does not exist in state, load it from firebase
        // if (state.currentGroup?.groupId !== linkData.groupId) {
        //   getGroupFromFirestore(linkData.groupId).then((res) => {
        //     if (!res?.membersArray.includes(user!.uid) && user) {
        //       // add use to group in firestore
        //       joinGroupFirebase(linkData.groupId, {
        //         isAdmin: false,
        //         name: user.displayName,
        //         status: "inactive",
        //         photoUrl: user.photoUrl,
        //         uid: user.uid,
        //         expoPushToken: user.expoPushToken,
        //       }).then(() => {
        //         // add user in redux store
        //         if (res) {
        //           dispatch(joinGroup(res!));
        //         }
        //       });
        //     }
        //   });
        // }
        dispatch(setPending(false));
      }
    }
    setUpdatingStatus(false);
  }, [linkData, user]);

  useEffect(() => {
    if (linkData) {
      dispatch(setCurrentGroup(linkData.groupId));
    }
  }, [state.groups.length]);

  useEffect(() => {
    if (state.currentGroup && user?.uid) {
      setUserStatus(state.currentGroup.members.get(user.uid)?.status);
    }
  }, [state.currentGroup]);

  // we removed deep links ):
  // const handleDeepLink = (event: any) => {
  //   console.log("Handling event");

  //   const data = Linking.parse(event.url);
  //   setLinkData(data.queryParams);
  //   // TODO: fix bug, to join a second group with the link you have to restart the app
  //   Linking.removeEventListener("url", handleDeepLink);
  // };

  // useEffect(() => {
  //   const getInitUrl = async () => {
  //     const initialUrl = await Linking.getInitialURL();

  //     if (initialUrl) {
  //       setLinkData(Linking.parse(initialUrl).queryParams);
  //     }
  //   };
  //   Linking.addEventListener("url", handleDeepLink);
  //   if (!linkData) {
  //     getInitUrl();
  //   }
  //   return () => {
  //     Linking.removeEventListener("url", handleDeepLink);
  //   };
  // }, []);

  const changeStatus = async () => {
    // TODO: only let the user change his status every x seconds to prevent spam

    // get the current status
    setUpdatingStatus(true);
    dispatch(setPending(true));

    const currentStatus = state.currentGroup?.members.get(user?.uid!)?.status;

    let newStatus = currentStatus;

    if (currentStatus) {
      if (currentStatus === "active") {
        newStatus = "inactive";
      } else if (currentStatus === "inactive") {
        newStatus = "active";
      }

      if (
        newStatus === undefined ||
        state.currentGroup === undefined ||
        user === undefined
      ) {
        console.log("Could not set new status. Some value is undefined");
        return;
      }

      // set the value in the document
      if (user?.uid && state.currentGroup) {
        await changeStatusInFirebase(newStatus, state.currentGroup, user.uid);
      }

      // set the value in react-redux
      dispatch(setCurrentStatus(newStatus, user.uid));
      setUpdatingStatus(false);
    }
  };

  return (
    <Box flex={1} bg={backgroundColor}>
      {state.currentGroup ? (
        <>
          <UserTable />
          <Box m="10px">
            {userStatus === "active" ? (
              <Button
                size="lg"
                colorScheme="red"
                onPress={changeStatus}
                isLoading={updatingStatus}
              >
                Set Not Ready!
              </Button>
            ) : (
              <Button
                size="lg"
                colorScheme="green"
                onPress={changeStatus}
                isLoading={updatingStatus}
              >
                Set Ready!
              </Button>
            )}
          </Box>
        </>
      ) : (
        <>
          {state.pending ? (
            <Spinner size="lg" />
          ) : (
            <Box flex={1}>
              <Box>
                <MaterialCommunityIcons
                  name="arrow-top-left-thick"
                  size={72}
                  color="black"
                  style={styles.arrowIcon}
                />
              </Box>
              <Center mx={5}>
                <Heading>Click here to select,create & join a group</Heading>
              </Center>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
export default GroupContent;

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    backgroundColor: "green",
    flexDirection: "column",
    justifyContent: "flex-start",
  },

  arrowIcon: {
    marginLeft: "7%",
  },
});
