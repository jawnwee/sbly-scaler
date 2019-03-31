import { combineReducers } from "redux";
import { ADD_AD_INSIGHTS } from "./constants";

const initialState = {
  adInsights: {},
  overview: {},
};

const adInsightsReducer = (state = initialState, action) => {
  if (action.type == ADD_AD_INSIGHTS) {

    // this is really inefficient, but for the sake of time -- doing the fastest possible to mold
    // to the data I want here for ad insights
    const response = action.payload;
    const date = action.payload.date;
    var adInsights = {};
    var totalSpend = 0;
    var totalRevenue = 0;
    response.forEach(function(res) {
      const insights = res.data
      const date = res.config.params.date;
      insights.forEach(function(insight) {
        const adID = insight.id;
        const spend = insight.spend === undefined ? 0 : insight.spend;
        const revenue = insight.revenue === undefined ? 0 : insight.revenue;
        const clicks = insight.clicks === undefined ? 0 : insight.clicks;
        totalSpend += spend;
        totalRevenue += revenue;
        let newInsight = {
          "spend": spend,
          "revenue": revenue,
          "clicks": clicks,
        };
        var mutatedInsights = {};
        if (adInsights[adID] === undefined) {
          mutatedInsights = {
            [date]: newInsight
          }
        } else {
          mutatedInsights = {
            ...adInsights[adID].insights,
            [date]: newInsight
          }
        }
        let newAdInsights = {
          ...adInsights,
          [adID]: {
            ...adInsights[adID],
            insights: mutatedInsights
          }
        }
        adInsights = newAdInsights;
      });
    });
    // spend: 7.62,
    // impressions: 2871,
    // revenue: 16.87,
    // clicks: 482,
    // id: 'a24cf682-fe5a-d243-d508-a6f3455326c7'
    let newState = {
      ...state,
      adInsights: {
        ...state.adInsights,
        adInsights,
      },
      overview: {
        totalSpend: totalSpend,
        totalRevenue: totalRevenue,
      }
    }
    return newState;
  }
  return initialState
}

export default combineReducers({
  adInsightsReducer
});;