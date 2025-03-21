import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
// Remove Footer import since it doesn't exist
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PillarView from './pages/PillarView';
import ProgressTracker from './pages/ProgressTracker';
import Challenges from './pages/Challenges';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
// Add new component imports
import Subscription from './components/Subscription';
import Rewards from './components/Rewards';
import './index.css';
import './styles/main.css'; // Add the new stylesheet if you've created it

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
              {/* Add new routes */}
              <PrivateRoute exact path="/subscription" component={Subscription} />
              <PrivateRoute exact path="/rewards" component={Rewards} />
              <Route component={NotFound} />
            </Switch>
          </main>
          {/* Remove Footer component */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
