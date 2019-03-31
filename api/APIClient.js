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
    })

    await axios.all(getRequests).then(response => {
      store.dispatch(addAdInsights(response));
    });

    // disaptch to redux store so that connect will handle and pass to all react components
  }

}

const client = new APIClient();

export default client;
