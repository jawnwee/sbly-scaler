var axios = require('axios')
const config = {
  headers: {'X-My-Custom-Header': 'Header-Value'}
};
const API_URL = 'http://api.shareably.net:3030';
axios.defaults.headers.common['Authorization'] = 'SHAREABLY_SECRET_TOKEN';

export class APIClient {

  constructor() {
  }

  getAllInsights() {
    /*
    Because the api is constrained to a specific date range, the api client is 
    "dumb" here and will just make the request for all date ranges.
    If I had more time, the data wouldn't calculated in real time, we would constantly be
    updating our db with new values so that this amount of fetching isn't required
    */
    const url = `${API_URL}/ad-insights`;
    const dates = ['2019-01-25', '2019-01-26', '2019-01-27','2019-01-28', '2019-01-29', '2019-01-30', '2019-01-31']
    const allMetrics = 'spend,impressions,revenue,clicks'
    return axios.get(url, {
      params: {
        date: '2019-01-25',
        metrics: allMetrics,
      }
    }).then(response => response.data);
  }

}