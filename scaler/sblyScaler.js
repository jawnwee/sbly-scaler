import regression from 'regression';
import APIClient from "../api/APIClient";
import store from "../redux/store";
import { addAdInsights } from "../redux/actions";

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
        store.dispatch(addAdInsights(tempInsights));
        finished(tempInsights);
      }
    }
  });
}

export const generateGraphPoints = function generateGraphPoints(adId, adInsights) {
  var roiDataPoints = [];
  var ctrDataPoints = [];
  if (adInsights === undefined) {
    return [];
  }
  if (adInsights[adId] === undefined) {
    return [];
  }
  const graph = adInsights[adId].graph;
  const avgROI = adInsights[adId].avgROI;
  if (!graph) {
    return []
  }
  var data = [];
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
      data.push({
        "date": date,
        "roi": roi,
        "ctr": ctr
      });
      roiDataPoints.push([index, roi]);
      ctrDataPoints.push([index, ctr]);
      index++;
  }
  const config = {
    precision: 5
  }
  const roiRegressionResult = regression.linear(roiDataPoints, config);
  const roiSlope = roiRegressionResult.equation[0];
  const roiYIntercept = roiRegressionResult.equation[1];

  const ctrRegressionResult = regression.linear(ctrDataPoints, config);
  const ctrSlope = ctrRegressionResult.equation[0];
  const ctrYIntercept = ctrRegressionResult.equation[1];
  var i;
  for (i = 0; i< data.length; i++) {
    data[i] = {
      ...data[i],
      "roiRegression": (roiSlope * i) + roiYIntercept,
      "ctrRegression": (ctrSlope * i) + ctrYIntercept,
    }
  }
  return data;
}

export const generateNewBudget = function generateNewBudget(adId, adInsights, budget) {
  var roiDataPoints = [];
  var ctrDataPoints = [];
  const graph = adInsights[adId].graph;
  const avgROI = adInsights[adId].avgROI;
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
  const config = {
    precision: 5
  }
  const roiRegressionResult = regression.linear(roiDataPoints, config);
  const roiSlope = roiRegressionResult.equation[0];
  const roiYIntercept = roiRegressionResult.equation[1];

  const ctrRegressionResult = regression.linear(ctrDataPoints, config);
  const ctrSlope = ctrRegressionResult.equation[0];
  const ctrYIntercept = ctrRegressionResult.equation[1];

  const newBudget = decisionTree(roiSlope, ctrSlope, avgROI, budget);

  return {
    ...adInsights,
    [adId]: {
      ...adInsights[adId],
      currentBudget: budget,
      suggestedBudget: newBudget,
    },
  };
}

function decisionTree(roiSlope, ctrSlope, avgROI, budget) {
  /*
  
  Our decision tree will fairly straightforward:
  // start with a 2x2 grid like so given our roi & :ctr regressions
        +CTR   -CTR
  +ROI
  -ROI

  Generate a seed scaler value
  if +ctr && +roi => increase budget by our maximum factor
  if -ctr && -roi => lower budget by maximum factor
  if -roi && +ctr => look at cpi & see if its worth increasing budget (ie, if cpi is less than total avg cpi) - decrease otherwise
  if +roi && -ctr => look at cpi & see if its worth increasing budget (ie, if cpi is less than total avg cpi) - decrease otherwise

  take the seed & use our overall ROI to determine an appropriate value to increase by since the roi could already be < 0

  eventaully get some % to increase our budget by

  */

  // I know in overall I wrote that 20% is max that we want, but this scale factor will go down and most likely be <=20%
  var scaleFactor = 0.25;
  var newBudget = budget
  if (ctrSlope > 0 && roiSlope > 0) {
    // leave as is
  } else if (ctrSlope < 0 && roiSlope > 0) {
    // branch into where roi is increasing and ctr is decreasing
    // we want to branch carefully here because ctr is going down; roi may be trending right now, but it could start going down
  } else if (ctrSlope > 0 && roiSlope < 0) {
    // if roi is trending down, but ctr is trending up, we still want to put money in this if our overall roi is doing well
  } else {
    // lower
    // I would pretty much reduce by 30% because this is just not a great one to invest in for obvious reasons
    return budget - (budget * 0.30);
  }
  return newBudget
}























