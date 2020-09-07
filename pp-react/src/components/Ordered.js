import React, { Component } from "react";
import "../styles/Orders.css";
import axios from "axios";
import Navbar from "./Navbar";
import logo from "../images/pantrytrans2.png";

class OrderComponent extends Component {
  constructor(props) {
    super(props);
  }

  chooseNotif1() {
    return (
      "You ordered " + this.props.food + " from " + this.props.otherUser + "."
    );
  }
  chooseNotif2() {
    return (
      "Please contact them with their phone number: " + this.props.otherPhone
    );
  }

  getBorder() {
    return "3px solid #ffbf5e";
  }

  render() {
    return (
      <div id="order-comp" style={{ border: this.getBorder() }}>
        <img
          src={require("../images/" + this.props.food + ".png")}
          id="orderPic"
        />
        <div className="rit-container">
          <p className="orderInfo">{this.chooseNotif1()}</p>
          <p className="orderInfo">{this.chooseNotif2()}</p>
        </div>
      </div>
    );
  }
}

export default class Ordered extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };

    this.getOrders();
  }
  getOrders() {
    axios
      .get(
        "/api/notificationItem/" + localStorage.getItem("username") + "/ordered"
      )
      .then((res) =>
        this.setState({
          orders: res.data,
        })
      );
  }
  toggleViews() {
    this.props.history.push("/orders");
  }

  render() {
    return (
      <div>
        <Navbar />
        <header className="Order-body">
          <img src={logo} id="logo" />
          <div id="orderedtop-container">
            <div id="pageHeader">Your Orders</div>

            <div onClick={() => this.toggleViews()} id="toggleOrderedBtn">
              <div id="outerToggle">Ordered</div>
              <div id="innerToggle">Orders</div>
            </div>
          </div>

          <div id="order-container">
            {this.state.orders.map((order, i) => (
              <OrderComponent
                key={i}
                type={order.type}
                expiration={order.expiration}
                username={order.username}
                food={order.food}
                id={order._id}
                otherUser={order.otherUser}
                otherPhone={order.otherPhone}
              />
            ))}
          </div>
        </header>
      </div>
    );
  }
}
