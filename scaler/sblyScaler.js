import regression from 'regression';
import APIClient from "../api/APIClient";


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
    dates.sort(function(a,b) {
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
  await determineNewBudget(result, finished);
};

async function determineNewBudget(adInsights, finished) {
  var adIds = [];
  if (adInsights) {
    adIds = Object.keys(adInsights);
  } else {
    finished(adInsights);
  }
  APIClient.fetchCurrentBudgets(adIds, function(currentBudgets) {
    var tempInsights = adInsights;
    for(var adId of adIds) {
      if (currentBudgets[adId]) {
        tempInsights = generateNewBudget(adId, tempInsights, currentBudgets[adId]);
        finished(tempInsights);
      }
    }
  });
}

export const generateNewBudget = function generateNewBudget(adId, adInsights) {
  var roiDataPoints = [];
  var ctrDataPoints = [];
  var graph = adInsights[adId].graph
  if (!graph) {
    return {}
  }
  const dates = Object.keys(graph);
  dates.sort(function(a,b) {
    return new Date(b.date) - new Date(a.date);
  });
  var index = 1;
  for(var date of dates) {
      const current = graph[date];
      const spend = current.spend;
      const revenue = current.revenue;
      const cpi = current.cpi;
      const roi = current.roi;
      const ctr = current.ctr;
      roiDataPoints.push([index, roi]);
      ctrDataPoints.push([index, ctr]);
      index++;
  }
  const result = regression.linear(roiDataPoints);
  const gradient = result.equation[0];
  const yIntercept = result.equation[1];
  return {
    ...adInsights,
    [adId]: {
      ...adInsights[adId],
      suggestedBudget: 10,
    },
  };
}























