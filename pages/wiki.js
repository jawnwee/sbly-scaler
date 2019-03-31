import Header from "../components/Header.js";
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const ReactMarkdown = require('react-markdown');
const ReactDOM = require('react-dom');

const input = `
## Overview

## Goals

## Strategies Used

## Links & References Used
- [Material UI](https://github.com/mui-org/material-ui)
- [NextJS](https://nextjs.org/)

`;

const styles = {
  root: {
    width: '100%',
    padding: '10px',
  },
};

function Overview(props) {
  const { classes } = props;

  return (
    <Header title='Wiki'>
      <Paper className={classes.root}>
        <ReactMarkdown source={input} />
      </Paper>
    </Header>
  );
}

export default withStyles(styles)(Overview);