import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        loading ? (
          <div className="loader">Loading...</div>
        ) : isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
