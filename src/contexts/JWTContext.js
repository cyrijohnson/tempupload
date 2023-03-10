import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
// utils
import axios from "../utils/axios";
import { isValidToken, setSession } from "../utils/jwt";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  refreshUser: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // DEBUG ON USER
  // useEffect(() => {
  //   console.log(state.user);
  // }, [state.user]);

  useEffect(() => {
    const initialize = async () => {
      console.log("Initializing auth context");
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get("/users/me");
          const user = response.data;

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    logout();
    const response = await axios.post("/auth/local", {
      identifier: email,
      password,
    });
    const { jwt, user } = response.data;
    setSession(jwt);

    dispatch({
      type: "LOGIN",
      payload: {
        user,
      },
    });
  };

  const register = async (email, password, username) => {
    logout();
    const response = await axios.post("/auth/local/register", {
      email,
      password,
      username,
    });
    const { jwt, user } = response.data;
    setSession(jwt);

    dispatch({
      type: "REGISTER",
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  const refreshUser = async () => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get("/users/me");
        const user = response.data;

        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
