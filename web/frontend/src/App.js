import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import RedditProfilePage from './RedittRegistration';
import ResultsPage from './ResultsPage';
import HomePage from './HomePage';
import ConversationalInterface from './ConversationForm';
import ImageUploadPage from './ImageUpload';

// import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/chat" component={ConversationalInterface} />
          <Route exact path="/image-upload" component={ImageUploadPage} />
          <Route path="/results" component={ResultsPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
