import React, { Component } from 'react';
import Header from "../components/Header.js";
import Typography from '@material-ui/core/Typography';
import AdInsightsTable from "../components/AdInsightsTable";
import SblyOverview from "../components/SblyOverview";
import APIClient from "../api/APIClient";

const Index = function(props) {
  const { sblyInsights } = props;
  return (
    <Header title='Overview'>
      <SblyOverview overview={sblyInsights.overview} />
      <AdInsightsTable adInsights={sblyInsights.adInsights} overview={sblyInsights.overview} />
    </Header>
  );
}

Index.getInitialProps = async function() {
  const result = await APIClient.fetchAllInsights();
  return {
    'sblyInsights': result
  }
};


export default Index