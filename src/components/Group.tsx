import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useColorModeValue } from "native-base";
import React, { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Firebase from "../../config/firebase";
import { CurrentUserContext, Groups, Member } from "../shared/types";
import { actionCreators, State } from "../store";
import {
  setCurrentGroup,
  setGroups,
  setPending,
  updateGroup,
} from "../store/action-creators";
import { firestoreToGroup } from "../util/auth/firestoreToGroup";
import { enumKeys } from "../util/enumKeys";
import { currentUserContext } from "./auth/CurrentUserProvider";
import DrawerContent from "./DrawerContent";
import GroupContent from "./GroupContent";

type GroupProps = {};

const Drawer = createDrawerNavigator();

const firestore = Firebase.firestore();

const Group: React.FC<GroupProps> = ({}) => {
  const { user } = useContext(currentUserContext) as CurrentUserContext;

  const dispatch = useDispatch();
  const { state } = useSelector((state: State) => state);

  const {} = bindActionCreators(actionCreators, dispatch);

  const prevGroups = useRef(0);

  // colors
  const headerBackgroundColor = useColorModeValue("white", "#2f3136");
  const headerTextColor = useColorModeValue("black", "white");

  const loadGroups = async () => {
    const myDocs = await firestore
      .collection("groups")
      .where("membersArray", "array-contains", user?.uid)
      .get();

    const groups: Groups = [];

    myDocs.docs.forEach((d) => {
      const data = d.data();
      const userMap = new Map<string, Member>();

      enumKeys(data.members).forEach((prop) => {
        userMap.set(String(prop), data.members[prop]);
      });

      groups.push({
        groupId: data.groupId,
        members: userMap,
        membersArray: data.membersArray,
        name: data.name,
        iconUrl: data.iconUrl || "https://www.broken.xyu/randomImage.jpg",
        everyoneIsReady: data.everyoneIsReady,
      });

      // now set the group in the store
      dispatch(setPending(true));
      dispatch(setGroups(groups));
      dispatch(setPending(false));
    });
  };

  const subToGroups = () => {
    const unsubs: (() => void)[] = [];

    state.groups.forEach((group) => {
      const unsub = firestore
        .collection("groups")
        .doc(group.groupId)
        .onSnapshot((doc) => {
          if (doc.data() !== undefined) {
            dispatch(updateGroup(firestoreToGroup(doc.data()!)));
          }
        });
      unsubs.push(unsub);
    });
    return unsubs;
  };

  useEffect(() => {
    // load all groups for the user

    if (user) {
      dispatch(setPending(true));
      loadGroups()
        .then(() => {
          // once we have loaded all teh groups, load  the last group the user clicked on
          AsyncStorage.getItem("@current_group_id").then((res) => {
            if (res) {
              dispatch(setCurrentGroup(res));
            }
          });
        })
        .catch((err) => {
          console.log("Error loading groups: ", err);
        })
        .finally(() => {
          dispatch(setPending(false));
        });

      // now add the listeners
    }
  }, [user]);

  useEffect(() => {
    let unsubs: (() => void)[] = [];

    prevGroups.current = state.groups.length;
    unsubs = subToGroups();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [state.groups.length]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: "85%", backgroundColor: headerBackgroundColor },
      }}
    >
      <Drawer.Screen
        name={state.currentGroup?.name || "Pick a group"}
        component={GroupContent}
        options={{
          headerTitleStyle: {
            color: headerTextColor,
          },
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
        }}
      />
    </Drawer.Navigator>
  );
};
export default Group;
