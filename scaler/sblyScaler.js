export const generateAdInsights = function generateAdInsights(adInsights, finished) {
  var adIds = [];
  console.log('generate function');
  console.log(adInsights);
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
    var totalSpend = 0;
    var totalRevenue = 0;
    var totalcpi = 0;
    var totalroi = 0;
    var totalctr = 0;
    var totalDates = 0
    for(var date of dates) {
      totalDates += 1;
      const current = data[date];
      const spend = current.spend;
      const revenue = current.revenue;
      const cpi = current.cpi;
      const roi = current.roi;
      const ctr = current.ctr;

      totalSpend += spend;
      totalRevenue += totalRevenue;
      totalcpi += cpi;
      totalroi += roi;
      totalctr += ctr
    }
    const avgSpend = totalSpend / totalDates;
    const avgRevenue = totalRevenue / totalDates;
    const avgCPI = totalcpi / totalDates;
    const avgROI = totalroi / totalDates;
    const avgCTR = totalctr / totalDates;

    const newResult = {
      ...result,
      [adID]: {
        "avgSpend": avgSpend,
        "avgRevenue": avgRevenue,
        "avgCPI": avgCPI,
        "avgROI": avgROI,
        "avgCTR": avgCTR,
      }
    };
    result = newResult;
  }
  finished(result);
};