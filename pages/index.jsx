import AppLayout from "components/layout/AppLayout";
import PageBuilder from "components/PageBuilder";

const HomeScreen = (props) => {
  return (
    <AppLayout>
      <PageBuilder slug="home" display />
    </AppLayout>
  );
};

export default HomeScreen;
