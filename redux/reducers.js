import { combineReducers } from "redux";
import { ADD_AD_INSIGHTS } from "./constants";
import { loadState } from "./localStorage";

var initialState = loadState();

const adInsightsReducer = (state = initialState, action) => {
  if (action.type == ADD_AD_INSIGHTS) {
    // this is really inefficient, but for the sake of time -- doing the fastest possible to mold
    // to the data I want here for ad insights
    const response = action.payload;
    return {
      ...state,
      adInsights: response
    };
  } else {
    return state;
  }
}

export default combineReducers({
  adInsightsReducer
});;