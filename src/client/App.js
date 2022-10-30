import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TestComponent from './components/TestComponent/TestComponent';

function App() {
  return (
    <Router>
      <Route exact path="/">
        <p>Testing pipeline</p>
      </Route>
      <Route exact path="/lol">
        <p>Testing pipeline</p>
      </Route>
      <Route exact path="/test-component">
        <TestComponent></TestComponent>
      </Route>
    </Router>
  );
}

export default App;
