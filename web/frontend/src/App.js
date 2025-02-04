// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './navBar';
import HomePage from './HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './mystery.css';
import ResultsPage from './ResultsPage';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/results" component={ResultsPage} />
      </Switch>
    </Router>
  );
}

export default App;
