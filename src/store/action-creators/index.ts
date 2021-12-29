import { Dispatch } from "@reduxjs/toolkit";
import { Group, Groups, Status } from "../../shared/types";
import { ActionType } from "../action-types";
import { Action } from "../actions";

export const createGroup = (newGroup: Group) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CREATE_GROUP,
      payload: newGroup,
    });
  };
};

export const deleteGroup = (id: string) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.DELETE_GROUP,
      payload: id,
    });
  };
};

export const setGroups = (groups: Groups) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_GROUPS,
      payload: groups,
    });
  };
};

export const setPending = (pending: boolean) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_PENDING,
      payload: pending,
    });
  };
};

export const setCurrentGroup = (id: string) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_CURRENT,
      payload: id,
    });
  };
};

export const setCurrentStatus = (status: Status, uid: string) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SET_CURRENT_STATUS,
      payload: {
        status,
        uid,
      },
    });
  };
};

export const joinGroup = (group: Group) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.JOIN_GROUP,
      payload: group,
    });
  };
};

export const leaveGroup = (group: Group) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.LEAVE_GROUP,
      payload: group,
    });
  };
};

export const updateGroup = (group: Group) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.UPDATE_GROUP,
      payload: group,
    });
  };
};

export const clearStore = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CLEAR_STORE,
    });
  };
};
