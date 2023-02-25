import combineReducers from "./combineReducers";
import { layoutInitialState, layoutReducer } from "./layoutReducer";
export const initialState = {
  layout: layoutInitialState,
};
export const rootReducer = combineReducers({
  layout: layoutReducer,
});
