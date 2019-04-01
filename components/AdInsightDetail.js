import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from "react-redux";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { generateGraphPoints } from "../scaler/sblyScaler";

const styles = {
  root: {
    padding: '10px',
  },
  title: {
    paddingLeft: 20,
    paddingTop: 5,
    fontWeight: 700,
    marginBottom: 30,
  },
};

const mapStateToProps = state => {
  return { ...state, adInsights: state.adInsightsReducer.adInsights, overview: state.adInsightsReducer.overview };
};

class ConnectedAdInsightDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes, adInsights, adId, overview} = this.props;
    const data = generateGraphPoints(adId, adInsights);
    var budgetCalculations = {}
    var suggestedBudget = 0
    if (adInsights) {
      if (adInsights[adId]) {
        budgetCalculations = adInsights[adId].budgetCalculations;
        suggestedBudget = adInsights[adId].suggestedBudget;
      }
    }
    const roiDotStyle = { stroke: '#8884d8' };
    const ctrDotStyle = { stroke: '#82ca9d' };
    return (
      <Paper className={classes.root} >
        <Typography variant='subtitle1' color="textSecondary" className={classes.title} noWrap>
          {adId}
        </Typography>
        <LineChart width={900} height={400} data={data}>
          <Line type="monotone" dataKey="roi" stroke="none" dot={roiDotStyle} activeDot={{r: 8}}/>
          <Line type="monotone" dataKey="ctr" stroke="none" dot={ctrDotStyle} activeDot={{r: 8}}/>
          <Line type="monotone" dataKey="roiRegression" stroke="#8884d8" />
          <Line type="monotone" dataKey="ctrRegression" stroke="#82ca9d" />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
        </LineChart>
        <Typography variant='subtitle1' color="textSecondary" className={classes.title} noWrap>
          Scaler
        </Typography>
        <Typography>
          ROI Slope: {budgetCalculations.roiSlope}
        </Typography>
        <Typography>
          CTR Slope: {budgetCalculations.ctrSlope}
        </Typography>
        <Typography>
          Scale Factor: {budgetCalculations.scaleFactor}
        </Typography>
        <Typography>
          Suggested Budget: {suggestedBudget}
        </Typography>
      </Paper>
    );
  }
}

const AdInsightDetail = connect(mapStateToProps)(ConnectedAdInsightDetail);

export default withStyles(styles)(AdInsightDetail);
