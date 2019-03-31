export const generateAdInsights = async function generateAdInsights(adInsights, finished) {
  var adIds = [];
  if (adInsights) {
    adIds = Object.keys(adInsights);
  } else {
    return;
  }
  var result = {};
  for(var adId of adIds) {
    const data = adInsights[adId].insights;
    if (!data) {
      break;
    }
    const dates = Object.keys(data);
    dates.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });
    var totalSpend = 0;
    var totalRevenue = 0;
    var totalcpi = 0;
    var totalroi = 0;
    var totalctr = 0;
    var totalDates = 0
    var graph = {}
    for(var date of dates) {
      totalDates += 1;
      const current = data[date];
      const spend = current.spend;
      const revenue = current.revenue;
      const cpi = current.cpi;
      const roi = current.roi;
      const ctr = current.ctr;
      graph = {
        ...graph,
        [date]: {
          "spend": spend,
          "revenue": revenue,
          "cpi": cpi,
          "roi": roi,
          "ctr": ctr,
        }
      }

      totalSpend += spend;
      totalRevenue += revenue;
      totalcpi += cpi;
      totalroi += roi;
      totalctr += ctr
    }
    const avgCPI = Math.round((totalcpi / totalDates) * 10000)/10000
    const avgROI = Math.round((totalroi / totalDates) * 10000)/10000;
    const avgCTR = Math.round((totalctr / totalDates) * 10000)/10000;
    console.log(graph);
    const newResult = {
      ...result,
      [adId]: {
        "totalSpend": Math.round(totalSpend * 100)/100,
        "totalRevenue": Math.round(totalRevenue * 100)/100,
        "avgCPI": avgCPI,
        "avgROI": avgROI,
        "avgCTR": avgCTR,
        "graph": graph,
      }
    };
    result = newResult;
  }
  finished(result);
  determineNewBudget(adInsights, finished);
};

async function determineNewBudget(adInsights, finished) {

} 