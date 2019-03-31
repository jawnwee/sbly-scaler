import Header from "../components/Header.js";
import Typography from '@material-ui/core/Typography';
import AdInsightsTable from "../components/AdInsightsTable";

const Overview = () => (
  <Header title='Overview'>
    <AdInsightsTable />
  </Header>
)

export default Overview