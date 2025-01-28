// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './navBar';
import HomePage from './HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './mystery.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        {}
      </Switch>
    </Router>
  );
}

export default App;
