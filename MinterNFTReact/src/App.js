/*// src/App.js
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import MinterPage from "./MinterPage";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={WelcomePage} />
          <Route exact path="/minter" component={MinterPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;*/

// src/App.js
import React from "react";
import MinterPage from "./MinterPage";

function App() {
  return (
    <div>
      <MinterPage />
    </div>
  );
}

export default App;
