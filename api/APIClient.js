var axios = require('axios')
const config = {
  headers: {'X-My-Custom-Header': 'Header-Value'}
};
const API_URL = 'http://api.shareably.net:3030';
axios.defaults.headers.common['Authorization'] = 'SHAREABLY_SECRET_TOKEN';

export class APIClient {

  constructor() {
  }

  getTest() {
    return axios.get('https://api.tvmaze.com/search/shows?q=batman')
  }

  getAllInsights() {
      const url = `${API_URL}/ad-insights`;
      return axios.get(url, {
        params: {
          date: '2019-01-25',
          metrics: 'spend',
        }
      }).then(response => response.data);
  }

}