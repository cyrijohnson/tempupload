import { useState, useEffect } from "react";

import { Grid } from "@mui/material";

import AppLayout from "components/layout/AppLayout";
import Builder from "components/page-builder/Builder";

import { useRouter } from "next/router";
import useAuth from "contexts/useAuth";

const StaticPage = (props) => {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  return router.isReady ? (
    <Grid item container>
      <Grid item xs={user && user.role.type == "admin" ? 9 : 12}>
        <AppLayout>
          <Builder
            slug={id}
            display={!(user && user.role.type == "admin")}
            fullWidth
          />
        </AppLayout>
      </Grid>
    </Grid>
  ) : (
    <div>Loading...</div>
  );
};

export default StaticPage;
