import regression from 'regression';
import APIClient from "../api/APIClient";
import store from "../redux/store";
import { addAdInsights } from "../redux/actions";

export const generateAdInsights = async function generateAdInsights(overview, adInsights, finished) {
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
  await determineNewBudget(overview, result, finished);
};

async function determineNewBudget(overview, adInsights, finished) {
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
        tempInsights = generateNewBudget(overview, adId, tempInsights, currentBudgets[adId]);
        store.dispatch(addAdInsights({
          adInsights: tempInsights,
          overview: overview,
        }));
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

export const generateNewBudget = function generateNewBudget(overview, adId, adInsights, budget) {
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

  const scaleFactor = decisionTree(roiSlope, ctrSlope, avgROI, budget, overview);
  const newBudget = calculateNewBudget(scaleFactor, budget);

  return {
    ...adInsights,
    [adId]: {
      ...adInsights[adId],
      currentBudget: budget,
      suggestedBudget: Math.round(newBudget*100)/100,
      budgetCalculations: {
        "roiSlope": roiSlope,
        "roiYIntercept": roiYIntercept,
        "ctrSlope": ctrSlope,
        "ctrYIntercept": ctrYIntercept,
        "avgROI": avgROI,
        "scaleFactor": scaleFactor,
      }
    },
  };
}

function decisionTree(roiSlope, ctrSlope, avgROI, budget, overview) {
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
  const overallROI = (overview.totalRevenue - overview.totalSpend) / overview.totalSpend;
  var increaseScaleFactor = 0.20;
  var decreaseScaleFactor = 0.20;

  if (overallROI < 0) {
    // be careful here for us since we're losing money, we want to be less aggressive in our incraseScaleFactor and make our decreaseScaleFactor higher
    increaseScaleFactor = 0.15;
    decreaseScaleFactor = 0.3
  } else {
    increaseScaleFactor = 0.20 * (1 + overallROI);
    // make sure our scale factor doesn't go too crazy
    if (increaseScaleFactor > 0.3) {
      increaseScaleFactor = 0.25;
    }
  }

  var newBudget = budget
  if (ctrSlope > 0 && roiSlope > 0) {
    // determine a budget based off our current ROI
    if (avgROI > 1) {
      increaseScaleFactor = 0.3
      return increaseScaleFactor
    } else {
      // scale the increase factor down based on avg roi
      return increaseScaleFactor * (1+avgROI);
    }
  } else if (ctrSlope < 0 && roiSlope > 0) {
    // branch into where roi is increasing and ctr is decreasing
    // we want to branch carefully here because ctr is going down; roi may be trending right now, but it could start going down
    // if the ctr downward slope is too high, we'll honestly want to scale down a bit
    increaseScaleFactor = increaseScaleFactor + roiSlope;

    // we want to scale down if ctr slope trending down
    if (increaseScaleFactor < 0.1) {
      return -decreaseScaleFactor * 0.5;
    }

    // otherwise, try scaling up
    return increaseScaleFactor
  } else if (ctrSlope > 0 && roiSlope < 0) {
    // if roi is trending down, but ctr is trending up, we still want to put money in this if our overall roi is doing well
    increaseScaleFactor = increaseScaleFactor + roiSlope;
    // if our avgROI is already < 0 -- scale down to be safe
    if (avgROI < 0) {
      return -(decreaseScaleFactor * (1+Math.abs(avgROI)))
    }
    // same as above, but with ROI slope; treat this more carefully though since ROI is our KPI here
    // if the increaseScaleFactor budges too much, we actually should scale down a lot because its risky
    if (increaseScaleFactor < 0.12) {
      return 0.1
    }

    // otherwise, lets try increasing
    return increaseScaleFactor
  } else {
    // lower this, but look at our current overall ROI and lower based off a scale on this
    if (avgROI >= 1) {
      return -0.08
    } else if (avgROI > 0 && avgROI < 1) {
      // since our ROI is still high, lets make sure to scale down less
      return -(decreaseScaleFactor * avgROI);
    }
    // use avg roi as a scale factor to increasingly scale down because it was already performing poorly
    return -(decreaseScaleFactor * (1+Math.abs(avgROI)));
  }

  // somehow hit here when it shouldn't
  return 0.01
}

function calculateNewBudget(scaleFactor, budget) {
  if (scaleFactor > 0) {
    return budget + (scaleFactor * budget);
  } else {
    return budget - (-scaleFactor * budget);
  }
}























