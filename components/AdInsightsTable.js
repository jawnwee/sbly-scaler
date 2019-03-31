import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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

function AdInsightsTable(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Typography variant='h6' color="textSecondary" className={classes.title}noWrap>
        Ad Insights
      </Typography>
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
    </Paper>
  );
}

AdInsightsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdInsightsTable);