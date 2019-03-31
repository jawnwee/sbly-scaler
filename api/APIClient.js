import store from "../redux/store";
import { addAdInsights } from "../redux/actions"

var axios = require('axios')
const config = {
  headers: {'X-My-Custom-Header': 'Header-Value'}
};
const API_URL = 'http://api.shareably.net:3030';
axios.defaults.headers.common['Authorization'] = 'SHAREABLY_SECRET_TOKEN';

class APIClient {

  constructor() {
  }

  async fetchCurrentBudgets(adIds, completion) {
    const url = `${API_URL}/ad`;
    var getRequests = [];
    adIds.forEach(function(adId) {
      getRequests.push(axios.get(`${url}/${adId}`));
    });
    await axios.all(getRequests).then(function(response) {
      var budgets = {};
      response.forEach(function(res) {
        const adId = res.data.id;
        const budget = res.data.budget;
        budgets = {
          ...budgets,
          [adId]: budget
        }
      });
      completion(budgets);
    });
  }

  async fetchAllInsights() {
    /*
    Because the api is constrained to a specific date range, the api client is 
    "dumb" here and will just make the request for all date ranges.
    If I had more time, the data wouldn't calculated in real time, we would constantly be
    updating our db with new values so that this amount of fetching isn't required.
    */
    const url = `${API_URL}/ad-insights`;
    const dates = ['2019-01-25', '2019-01-26', '2019-01-27','2019-01-28', '2019-01-29', '2019-01-30', '2019-01-31'];
    const allMetrics = 'spend,impressions,revenue,clicks';
    var getRequests = [];
    dates.forEach(function(date) {
      getRequests.push(axios.get(url, {
        params: {
          date: date,
          metrics: allMetrics,
        }
      }))
    });

    const result = await axios.all(getRequests);
    const response = result;
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
        const impressions = insight.impressions === undefined ? 0 : insight.impressions;
        totalSpend += spend;
        totalRevenue += revenue;
        let newInsight = {
          "spend": spend,
          "revenue": revenue,
          "clicks": clicks,
          "impressions": impressions,
          "cpi": spend/impressions,
          "ctr": clicks/impressions,
          "roi": (revenue - spend)/spend,
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
      adInsights: adInsights,
      overview: {
        totalSpend: Math.round(totalSpend*100)/100,
        totalRevenue: Math.round(totalRevenue*100)/100,
      }
    }
    return newState;

    // disaptch to redux store so that connect will handle and pass to all react components
  }

}

const client = new APIClient();

export default client;
