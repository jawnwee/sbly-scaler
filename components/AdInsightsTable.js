import { connect } from "react-redux";
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

const mapStateToProps = state => {
  return { ...state, adInsights: state.adInsightsReducer.adInsights.adInsights };
};

class ConnectedAdInsightsTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      adInsights: props.adInsights,
    }
    this.finishedScaling = this.finishedScaling.bind(this);
    generateAdInsights(props.adInsights, this.finishedScaling);
  }


  finishedScaling = (newAdInsights) => {
    console.log("finished scaling hit");
    console.log(newAdInsights);
    this.setState({
      loading: false,
      adInsights: newAdInsights,
    });
  }

  renderTableBody = () => {
    const { adInsights } = this.state;
    // return (
    //   {data.map(n => (
    //         <TableRow key={n.id}>
    //           <TableCell component="th" scope="row">
    //             {n.name}
    //           </TableCell>
    //           <TableCell align="right">{n.calories}</TableCell>
    //           <TableCell align="right">{n.fat}</TableCell>
    //           <TableCell align="right">{n.carbs}</TableCell>
    //           <TableCell align="right">{n.protein}</TableCell>
    //           <TableCell align="right">lol</TableCell>
    //         </TableRow>
    //       ))}
    //   );
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Ad ID</TableCell>
            <TableCell align="right">Total Revenue</TableCell>
            <TableCell align="right">Total Spend</TableCell>
            <TableCell align="right">𝜇 CTR</TableCell>
            <TableCell align="right">𝜇 CPM</TableCell>
            <TableCell align="right">New Budget</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        </TableBody>
      </Table>
    );
  }

  render() {
    const { classes, adInsights } = this.props;
    const { loading } = this.state;
    var adIds = []
    if (adInsights) {
      adIds = Object.keys(adInsights);
    }
    console.log(loading);
    console.log("rendered again");
    return (
      <Paper className={classes.root}>
        <Typography variant='h6' color="textSecondary" className={classes.title}noWrap>
          Ad Insights
        </Typography>
        {
          loading ? (
            <CircularProgress />
          ) : (
            this.renderTableBody()
          )
        }
      </Paper>
    );
  }
}

const AdInsightsTable = connect(mapStateToProps)(withStyles(styles)(ConnectedAdInsightsTable));

export default AdInsightsTable;