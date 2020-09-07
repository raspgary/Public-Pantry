import React, { Component } from "react";
import "../styles/Orders.css";
import { Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import logo from "../images/pantrytrans2.png";

class OrderComponent extends Component {
  constructor(props) {
    super(props);
  }

  chooseNotif1() {
    return this.props.otherUser + " ordered " + this.props.food + " from you.";
  }

  chooseNotif2() {
    return (
      "Please contact them with their phone number: " + this.props.otherPhone
    );
  }

  getBorder() {
    return "3px solid #96cafd";
  }

  render() {
    return (
      <div id="ordered-comp" style={{ border: this.getBorder() }}>
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

export default class Orders extends Component {
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
        "/api/notificationItem/" + localStorage.getItem("username") + "/order"
      )
      .then((res) =>
        this.setState({
          orders: res.data,
        })
      );
  }
  toggleViews() {
    this.props.history.push("/ordered");
  }

  render() {
    return (
      <div>
        <Navbar />
        <header className="Order-body">
          <img src={logo} id="logo" />
          <div id="orderedtop-container">
            <div id="pageHeader">Orders for You</div>

            <div onClick={() => this.toggleViews()} id="toggleOrderedBtn">
              <div id="outer2Toggle">Ordered</div>
              <div id="inner2Toggle">Orders</div>
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
