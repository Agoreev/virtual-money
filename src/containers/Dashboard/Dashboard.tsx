import React from "react";
import NavBar from "./NavBar/NavBar";
import TransactionsTable from "./TransactionsTable/TransactionsTable";
import { Container, Box } from "@material-ui/core";

const Dashboard: React.FC = () => {
  return (
    <div className="Dashboard">
      <NavBar />
      <Box mt={4}>
        <Container>
          <TransactionsTable />
        </Container>
      </Box>
    </div>
  );
};

export default Dashboard;
