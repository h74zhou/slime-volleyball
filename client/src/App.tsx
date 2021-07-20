import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Join from './components/Join/Join';
import Game from './components/Game/Game';


const App = () => (
  <Router>
    <Route path="/" exact component={Join} />
    <Route path="/game" exact component={Game} />
  </Router>
);

export default App;