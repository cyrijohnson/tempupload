import { useState, useEffect } from "react";

import AppLayout from "components/layout/AppLayout";
import PageBuilder from "components/PageBuilder";

import { useRouter } from "next/router";

const StaticPage = (props) => {
  const router = useRouter();
  const { id } = router.query;

  return router.isReady ? (
    <AppLayout>
      <PageBuilder slug={id} />
    </AppLayout>
  ) : (
    <div>Loading...</div>
  );
};

export default StaticPage;
