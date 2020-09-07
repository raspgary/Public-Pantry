import React, { Component } from "react";
import "./App.css";
import { Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./components/Login";
import Pantry from "./components/Pantry";
import Donations from "./components/Donate";
import Notifications from "./components/Notification";
import Orders from "./components/Orders";
import Ordered from "./components/Ordered";
import Reward from "./components/Reward";
import Solds from "./components/Sell";
import Feed from "./components/Feed";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/feed" component={Feed} />
          <Route exact path="/pantry" component={Pantry} />
          <Route exact path="/donate" component={Donations} />
          <Route exact path="/notifications" component={Notifications} />
          <Route exact path="/sell" component={Solds} />
          <Route exact path="/ordered" component={Ordered} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/rewards" component={Reward} />
        </BrowserRouter>
        {/* <Header />
        <Route exact path="/" component={Calculator} />
        <Route exact path="/history" component={History} /> */}
      </div>
    );
  }
}

export default App;
