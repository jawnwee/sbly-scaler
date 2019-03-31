import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const leftPadding = 20;

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: 16,
  },
  paper: {
    height: 140,
  },

  control: {
    padding: theme.spacing.unit * 2,
  },

  title: {
    paddingLeft: leftPadding,
    paddingTop: 5,
    fontWeight: 700,
  },

  header: {
    fontFamily: "Eczar",
    paddingLeft: leftPadding,
    marginRight: 60,
    marginTop: 5,
  },
});



class SblyOverview extends React.Component {
  state = {
    spacing: '16',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { classes, overview } = this.props;
    const { spacing } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item>
          <Paper className={classes.paper}>
            <Typography variant='subtitle1' color="textSecondary" className={classes.title} noWrap>
              Revenue
            </Typography>
            <Typography variant='h2' color="textSecondary" className={classes.header} noWrap>
              ${overview.totalRevenue}
            </Typography>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.paper}>
            <Typography variant='subtitle1' color="textSecondary" className={classes.title} noWrap>
              Spend
            </Typography>
            <Typography variant='h2' color="textSecondary" className={classes.header} noWrap>
              ${overview.totalSpend}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(SblyOverview);
