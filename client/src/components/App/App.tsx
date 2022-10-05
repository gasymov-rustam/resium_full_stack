import { FC, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAllPlanes } from "../../features/planesSlice/planeSlice";
import { getPlanes } from "../../features/planesSlice/getPlanes";
import { fetchCheckAuth } from "../../features/authSlice/fetchCheckAuth";
import { routes } from "../../routes/routes";
import { Loader } from "../Loader";
import { GET_ALL_PLANES } from "../../apollo/query/planes";

import styles from "./App.module.css";

export const App: FC = () => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const { isApolloServer } = useAppSelector((state) => state.server);
  const dispatch = useAppDispatch();
  // const [getApolloPlanes, { data: planes, loading: apolloLoading }] = useLazyQuery(GET_ALL_PLANES, {
  //   onError: (error: ApolloError) => dispatch(setApolloErrorToGetPlanes(error)),
  // });
  const [getApolloPlanes, { data: planes, loading: apolloLoading }] = useLazyQuery(GET_ALL_PLANES);

  useEffect(() => {
    if (isApolloServer && isAuthenticated) {
      dispatch(getPlanes());
      dispatch(fetchCheckAuth());
    }
  }, [dispatch, isApolloServer, isAuthenticated]);

  useEffect(() => {
    if (!isApolloServer && !apolloLoading && user?.accessToken) {
      getApolloPlanes();
      dispatch(getAllPlanes(planes?.getAllPlanes));
    }
  }, [isApolloServer, planes, isAuthenticated, apolloLoading, dispatch, getApolloPlanes, user]);

  if (isLoading || apolloLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.root}>
      <Switch>
        {routes.map((route) => (
          <Route
            key={route.path}
            exact={route.exact}
            path={route.path}
            component={route.component}
          />
        ))}
      </Switch>

      {isAuthenticated ? <Redirect to="/" /> : <Redirect to="/login" />}
    </div>
  );
};
