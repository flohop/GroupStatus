import { combineReducers } from "@reduxjs/toolkit";
import groupReducer from "./groupReducer";

const reducers = combineReducers({
  state: groupReducer,
});

export default reducers;

export type State = ReturnType<typeof reducers>;
