import React, { Component } from "react";
import "../styles/Pantry.css";
import axios from "axios";
import Navbar from "./Navbar";
import logo from "../images/pantrytrans2.png";

class DonateComponent extends Component {
  constructor(props) {
    super(props);
    this.deletePantry = this.deletePantry.bind(this);
  }
  deletePantry(id) {
    axios.delete("/api/donateItem/" + id).then((res) => console.log(res.data));
    const { deleteDonCallback } = this.props;
    deleteDonCallback(id);
  }

  hello() {
    return this.props.name;
  }

  render() {
    return (
      <div id="donate-comp" style={{ border: "3px solid #77dd77" }}>
        <img
          src={require("../images/" + this.props.name + ".png")}
          id="donatePic"
        />

        <div className="r-container">
          <p className="donateInfo">Product: {this.props.name}</p>
          <p className="donateInfo">Quantity: {this.props.quantity}</p>
          <p className="donateInfo">
            {" "}
            Expiration Date: {this.props.expiration}
          </p>
          <p className="donateInfo">Description: {this.props.description}</p>
          <button
            onClick={() => this.deletePantry(this.props.id)}
            style={{ background: "3px solid #77dd77" }}
            id="deletePBtn"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

export default class Donations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donations: [],
    };
    this.handleDonDeleteCallback = this.handleDonDeleteCallback.bind(this);
    this.updateDonations();
    this.getDonations();
  }
  updateDonations() {
    var donations = [];

    axios
      .get("/api/donateItem")
      .then((res) => (donations = res.data))
      .then(() => this.updateDonationsHelper(donations));
  }

  updateDonationsHelper(foods) {
    var now = new Date();
    for (var i in foods) {
      var food = foods[i];
      var exp = food.expiration;
      var arr = exp.split("/");
      var date = new Date(
        parseInt("20" + arr[2], 10),
        parseInt(arr[0], 10) - 1,
        parseInt(arr[1], 10),
        0,
        0,
        0,
        0
      );
      if (now - date > 0) {
        axios
          .delete("/api/donateItem/" + food._id)
          .then((res) => console.log(res.data));
      } else {
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 1) {
          axios
            .delete("/api/donateItem/" + food._id)
            .then((res) => console.log(res.data));
        }
      }
    }
  }
  getDonations() {
    axios
      .get("/api/donateItem/" + localStorage.getItem("username"))
      .then((res) =>
        this.setState({
          donations: res.data,
        })
      );
  }
  handleDonDeleteCallback(id) {
    console.log(id);
    var tempDons = this.state.donations.filter((obj) => obj._id !== id);
    this.setState({
      donations: tempDons,
    });
  }
  toggleViews() {
    this.props.history.push("/pantry");
  }
  render() {
    return (
      <div>
        <Navbar />
        <header className="Pantry-body">
          <img src={logo} id="logo" />

          <div id="pantrytop-container">
            <div id="pageHeader">Donations</div>
            <div onClick={() => this.toggleViews()} id="toggleOrderedBtn">
              <div id="outer22Toggle">Donations</div>
              <div id="inner22Toggle">Pantry</div>
            </div>
          </div>
          <div id="pantry-container">
            {this.state.donations.map((donation, i) => (
              <DonateComponent
                key={i}
                name={donation.name}
                expiration={donation.expiration}
                username={donation.username}
                id={donation._id}
                quantity={donation.quantity}
                picture={donation.picture}
                description={donation.description}
                deleteDonCallback={this.handleDonDeleteCallback}
              />
            ))}
          </div>
        </header>
      </div>
    );
  }
}
