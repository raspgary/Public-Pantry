import React, { Component } from "react";
import "../styles/Login.css";
import axios from "axios";
import logo from "../images/pantrytrans2.png";
import background from "../images/Background2.png";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onFocus = () => {
    var login = document.getElementById("login");
    if (login.value === "User ID") {
      login.value = "";
    }
  };
  onBlur = () => {
    var login = document.getElementById("login");
    if (login.value === "") {
      console.log("here");
      login.value = "User ID";
    }
  };

  changePage = (data) => {
    localStorage.setItem("username", data[0].username);
    localStorage.setItem("name", data[0].name);
    localStorage.setItem("rewards", data[0].rewards);
    localStorage.setItem("longitude", data[0].longitude);
    localStorage.setItem("latitude", data[0].latitude);
    localStorage.setItem("phone", data[0].phone);
    this.props.history.push("/feed");
  };

  tryLogin = () => {
    var loginVal = document.getElementById("login").value;
    axios.get("/api/userItem/" + loginVal).then((res) => {
      if (res.data.length != 0) {
        console.log(res.data);
        this.changePage(res.data);
      }
    });
  };

  render() {
    return (
      <header className="background-body">
        <img src={background} className="background-photo" />

        <div id="pagewrap">
          <div id="spacing-from-icon">
            <img src={logo} id="logo" />
          </div>
          <label id="slogan1">Welcome to Public Pantry</label>
          <label id="slogan2">
            Connecting the community through food conservation.
          </label>
          <div id="spacing">
            <input
              type="text"
              id="login"
              defaultValue="User ID"
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
            />
          </div>
          <button id="loginbtn" onClick={() => this.tryLogin()}>
            Login
          </button>
        </div>
      </header>
    );
  }
}
