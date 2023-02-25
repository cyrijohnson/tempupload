import axios from "utils/axios";

export default function withAuthServerSideProps(getServerSidePropsFunc) {
  console.log("Running auth");
  return async () => {
    try {
      const user = await getUser();
      console.log(user);
      if (!user) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }
      if (getServerSidePropsFunc) {
        return { props: { user, data: await getServerSidePropsFunc(user) } };
      }
      return { props: { user, data: { props: { user } } } };
    } catch (error) {
      console.log(error);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };
}

const getUser = async () => {
  const response = await axios.get("/users/me");
  const user = response.data;
  return user;
};
