import React, { Component } from 'react';
import Header from "../components/Header.js";
import Typography from '@material-ui/core/Typography';
import AdInsightsTable from "../components/AdInsightsTable";
import SblyOverview from "../components/SblyOverview";
import APIClient from "../api/APIClient";

const Index = function(props) {
  const { sblyInsightsScaled } = props;
  return (
    <Header title='Overview'>
      <SblyOverview overview={sblyInsightsScaled.overview} />
      <AdInsightsTable adInsights={sblyInsightsScaled.adInsights} overview={sblyInsightsScaled.overview} />
    </Header>
  );
}

Index.getInitialProps = async function() {
  const result = await APIClient.fetchAllScaledInsights();
  return {
    'sblyInsightsScaled': result,
  }
};

export default Index