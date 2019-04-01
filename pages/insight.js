import React, { Component } from 'react';
import Header from "../components/Header.js";
import Typography from '@material-ui/core/Typography';
import APIClient from "../api/APIClient";
import AdInsightDetail from "../components/AdInsightDetail";
import { withRouter } from 'next/router'

const Insight = withRouter(function(props) {
  console.log(props);
  const adId = props.router.query.adId;
  if (adId === undefined) {
    return (
      <Header title='Insight'>
      </Header>
    );
  }
  return (
    <Header title='Insight'>
      <AdInsightDetail adId={adId}/>
    </Header>
  );
});

export default Insight