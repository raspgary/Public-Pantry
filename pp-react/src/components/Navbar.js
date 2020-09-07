import React, { Component } from "react";
import "../styles/Navbar.css";

export default class Header extends Component {
  render() {
    return (
      <nav id="sidebar">
        <div className="sidebar-header">
          <h3>Welcome, {localStorage.getItem("name")}</h3>
        </div>
        <div id="pic-container">
          <img
            src={require("../images/" +
              localStorage.getItem("username") +
              ".jpg")}
            id="propic"
          />
        </div>

        <ul className="list-unstyled components">
          <li className="active">
            <a href="/feed">Feed</a>
          </li>
          <li>
            <a href="/notifications">Notifications</a>
          </li>
          <li>
            <a
              onClick={() => {
                this.props.history.push("/pantry");
              }}
              href="/pantry"
            >
              Pantry
            </a>
          </li>

          <li>
            <a href="/sell">Sell</a>
          </li>
          <li>
            <a href="/ordered">Orders</a>
          </li>

          <li>
            <a href="/rewards">Rewards</a>
          </li>
          <li>
            <a href="/">Logout</a>
          </li>
        </ul>
      </nav>
    );
  }
}
