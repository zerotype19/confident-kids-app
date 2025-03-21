import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PillarView from './pages/PillarView';
import ProgressTracker from './pages/ProgressTracker';
import Challenges from './pages/Challenges';
import Subscription from './components/Subscription';
import Rewards from './components/Rewards';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import './index.css';
import './styles/main.css'; // Add the new stylesheet

// Premium route component
const PremiumRoute = ({ component: Component, ...rest }) => {
  const { hasPremiumAccess, loading } = useAuth();
  
  return (
    <Route
      {...rest}
      render={props => {
        if (loading) {
          return <div>Loading...</div>;
        }
        
        if (!hasPremiumAccess()) {
          return <Redirect to="/subscription" />;
        }
        
        return <Component {...props} />;
      }}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute exact path="/pillar/:id" component={PillarView} />
              <PrivateRoute exact path="/progress" component={ProgressTracker} />
              <PrivateRoute exact path="/challenges" component={Challenges} />
              <PrivateRoute exact path="/subscription" component={Subscription} />
              <PremiumRoute exact path="/rewards" component={Rewards} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
