import { Group, Groups, Status } from "../../shared/types";
import { ActionType } from "../action-types";

interface CreateAction {
  type: ActionType.CREATE_GROUP;
  payload: Group;
}

interface SetGroups {
  type: ActionType.SET_GROUPS;
  payload: Groups;
}

interface DeleteAction {
  type: ActionType.DELETE_GROUP;
  payload: string; // do later
}

interface SetPending {
  type: ActionType.SET_PENDING;
  payload: boolean;
}

interface SetCurrent {
  type: ActionType.SET_CURRENT;
  payload: string; // id of the current group
}

interface SetCurrentStatus {
  type: ActionType.SET_CURRENT_STATUS;
  payload: {
    status: Status;
    uid: string;
  }; // the new status
}

interface JoinGroup {
  type: ActionType.JOIN_GROUP;
  payload: Group;
}

interface LeaveGroup {
  type: ActionType.LEAVE_GROUP;
  payload: Group;
}

interface UpdateGroup {
  type: ActionType.UPDATE_GROUP;
  payload: Group;
}

interface ClearStore {
  type: ActionType.CLEAR_STORE;
}

export type Action =
  | CreateAction
  | DeleteAction
  | SetGroups
  | SetPending
  | SetCurrent
  | SetCurrentStatus
  | JoinGroup
  | LeaveGroup
  | UpdateGroup
  | ClearStore;
