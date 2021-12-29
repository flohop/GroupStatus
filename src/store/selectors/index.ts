import { createSelector } from "reselect";
import { Status } from "../../shared/types";
import { State } from "../reducers/index";

const getStatuses = (state: State) => {
  const status: Status[] = [];
  state.state.currentGroup?.members.forEach((member) => {
    status.push(member.status);
  });

  return status;
};

export const allReady = createSelector(
  getStatuses,
  (statuses) => !statuses.includes("inactive")
);
