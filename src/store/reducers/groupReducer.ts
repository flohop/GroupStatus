import AsyncStorage from "@react-native-async-storage/async-storage";
import { Group, Groups } from "../../shared/types";
import { ActionType } from "../action-types";
import { Action } from "../actions";

const initialState: {
  pending: boolean;
  groups: Groups;
  currentGroup: Group | undefined;
} = {
  pending: true,
  groups: [],
  currentGroup: undefined,
};

const reducer = (state: typeof initialState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.CREATE_GROUP:
      return { ...state, groups: [...state.groups, action.payload] };
    case ActionType.DELETE_GROUP:
      return state; // DO later
    case ActionType.SET_GROUPS:
      // on initial load, get all groups from firestore and set them in the state
      return { ...state, groups: action.payload };
    case ActionType.UPDATE_GROUP:
      // set the group to the new updated value
      const updatedGroups = state.groups.filter(
        (g) => g.groupId !== action.payload.groupId
      );

      updatedGroups.push(action.payload);

      // if the current group is the one being updated, we have to updated it as well
      if (state.currentGroup?.groupId === action.payload.groupId) {
        return {
          ...state,
          groups: updatedGroups,
          currentGroup: action.payload,
        };
      }

      return { ...state, groups: updatedGroups, pending: false };
    case ActionType.SET_PENDING:
      // if true, the data is loading.
      return { ...state, pending: action.payload };

    case ActionType.JOIN_GROUP:
      // adds the given group to the list of groups
      // if the group exists, don't add it to the list
      if (
        state.groups.filter((g) => g.groupId === action.payload.groupId)
          .length > 0
      ) {
        return { ...state };
      }
      return {
        ...state,
        groups: [...state.groups, action.payload],
        currentGroup: action.payload,
        pending: false,
      };

    case ActionType.LEAVE_GROUP:
      // remove the user from the group and set current group to undefined
      const newGroups = state.groups.filter(
        (g) => g.groupId !== action.payload.groupId
      );

      return { pending: false, groups: newGroups, currentGroup: undefined };

    case ActionType.SET_CURRENT_STATUS:
      // set  the new status for the current group
      if (state.currentGroup) {
        const newGroup = state.currentGroup;
        newGroup!.members.get(action.payload.uid)!.status =
          action.payload.status;

        // check if everyone is ready
        let everyoneIsReady = true;
        state.currentGroup.members.forEach((mem) => {
          if (mem.status === "inactive") {
            everyoneIsReady = false;
          }
        });
        newGroup.everyoneIsReady = everyoneIsReady;

        return { ...state, currentGroup: newGroup, pending: false };
      }
      return { ...state };

    case ActionType.SET_CURRENT:
      // set the current group, get the group by its id
      const group = state.groups.filter((g) => g.groupId === action.payload)[0];

      // if a group with that id does not exists, do nothing
      if (!group) {
        return { ...state };
      }

      if (action.payload) {
        AsyncStorage.setItem("@current_group_id", action.payload);
      }

      return { ...state, currentGroup: group, pending: false };

    case ActionType.CLEAR_STORE:
      // add every new attribute in the store here
      return {
        groups: [],
        currentGroup: undefined,
        pending: false,
      };

    default:
      return state;
  }
};

export default reducer;
