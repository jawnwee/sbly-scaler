import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { generateAdInsights } from "../scaler/sblyScaler"; 

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  title: {
    fontWeight: 700,
    paddingLeft: 20,
    paddingTop: 10
  },
};
class ConnectedAdInsightsTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      adInsights: props.adInsights,
    }
    this.finishedScaling = this.finishedScaling.bind(this);
    this.renderTableRow = this.renderTableRow.bind(this);
  }

  componentDidMount() {
    const { adInsights } = this.props;
    generateAdInsights(adInsights, this.finishedScaling);
  }

  finishedScaling = (newAdInsights) => {
    this.setState({
      adInsights: newAdInsights
    });
  }

  renderTableRow = (adIds, adInsights) => {
    var rows = []
    adIds.forEach(function(adId) {
      const totalSpend = adInsights[adId].totalSpend;
      const totalRevenue = adInsights[adId].totalRevenue;
      const avgCPI = adInsights[adId].avgCPI;
      const avgROI = adInsights[adId].avgROI;
      const avgCTR = adInsights[adId].avgCTR;
      const suggestedBudget = adInsights[adId].suggestedBudget;
      rows.push(
        <TableRow key={adId}>
          <TableCell component="th" scope="row">
            {adId}
          </TableCell>
          <TableCell align="right">{totalRevenue}</TableCell>
          <TableCell align="right">{totalSpend}</TableCell>
          <TableCell align="right">{avgCTR}</TableCell>
          <TableCell align="right">{avgCPI}</TableCell>
          <TableCell align="right">
            { suggestedBudget === undefined ? (
                <CircularProgress size={24} />
              ): (
                <div>
                  {suggestedBudget}
                </div>
              )
            }
          </TableCell>
        </TableRow>
      )
    });
    return rows;
  }

  renderTableBody = () => {
    const { classes } = this.props;
    const { adInsights } = this.state;
    var adIds = []
    if (adInsights) {
      adIds = Object.keys(adInsights);
    }
    var components = [];
    for(var adId of adIds) {
      const data = adInsights[adId];
      if (!data) {
        break;
      }
    }
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Ad ID</TableCell>
            <TableCell align="right">Total Revenue</TableCell>
            <TableCell align="right">Total Spend</TableCell>
            <TableCell align="right">𝜇 CTR</TableCell>
            <TableCell align="right">𝜇 CPM</TableCell>
            <TableCell align="right">Suggested Budget</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.renderTableRow(adIds, adInsights)}
        </TableBody>
      </Table>
    );
  }

  render() {
    const { classes, adInsights } = this.props;
    const { loading } = this.state;
    var adIds = []
    return (
      <Paper className={classes.root}>
        <Typography variant='h6' color="textSecondary" className={classes.title}noWrap>
          Ad Insights
        </Typography>
        {this.renderTableBody()}
      </Paper>
    );
  }
}

ConnectedAdInsightsTable.propTypes = {
  adInsights: PropTypes.object.isRequired
};

export default withStyles(styles)(ConnectedAdInsightsTable);