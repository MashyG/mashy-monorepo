import { configureStore, combineReducers } from "@reduxjs/toolkit";

/* number Reducer */
function numberReducer(state = 1, action: any) {
  console.log("numberReducer", state, action);
  switch (action.type) {
    case "ADD":
      return state + 1;
    case "DEL":
      return state - 1;
    default:
      return state;
  }
}
/* 用户信息reducer */
function InfoReducer(state = {}, action: any) {
  console.log("InfoReducer", state, action);
  const { payload = {} } = action;
  switch (action.type) {
    case "SET":
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}

export default configureStore({
  reducer: combineReducers({
    number: numberReducer,
    info: InfoReducer,
  }),
});
