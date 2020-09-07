import React, { Component } from "react";
import "../styles/Notification.css";
import axios from "axios";
import Navbar from "./Navbar";
import logo from "../images/pantrytrans2.png";

class NotificationComponent extends Component {
  constructor(props) {
    super(props);
  }

  chooseNotif1() {
    if (this.props.type === "expired") {
      return "Expired: " + this.props.food;
    } else if (this.props.type === "expireSoon") {
      return "Expiring Soon: " + this.props.food;
    } else if (this.props.type === "order" || this.props.type === "ordered") {
      return "Congratulations!";
    }
  }

  chooseNotif2() {
    if (this.props.type === "expired" || this.props.type === "expireSoon") {
      return "Expiration Date: " + this.props.expiration;
    } else if (this.props.type === "order") {
      return (
        this.props.otherUser + " ordered " + this.props.food + " from you."
      );
    } else if (this.props.type === "ordered") {
      return (
        "You ordered " + this.props.food + " from " + this.props.otherUser + "."
      );
    }
  }

  chooseNotif3() {
    if (this.props.type === "expired") {
      return "Please compost it if possible or throw it out.";
    } else if (this.props.type === "expireSoon") {
      return "Please eat it or consider donating it.";
    } else if (this.props.type === "order" || this.props.type === "ordered") {
      return (
        "Please contact them with their phone number: " + this.props.otherPhone
      );
    }
  }

  getBorder() {
    if (this.props.type === "expired") {
      return "3px solid #fd9696";
    } else if (this.props.type === "expireSoon") {
      return "3px solid #fdfd96";
    } else if (this.props.type === "order") {
      return "3px solid #9697fd";
    } else if (this.props.type === "ordered") {
      return "3px solid #77dd77";
    }
  }

  render() {
    return (
      <div id="notification-comp" style={{ border: this.getBorder() }}>
        <p className="notificationInfo">{this.chooseNotif1()}</p>
        <p className="notificationInfo">{this.chooseNotif2()}</p>
        <p className="notificationInfo">{this.chooseNotif3()}</p>
        {/* <p className="notificationInfo">{this.props.expiration}</p> */}
        {/* <button
          onClick={() => this.deletePantry(this.props.id)}
          id="deletePantryBtn"
        >
          X
        </button> */}

        {/* <button
          // onClick={() =>
          //   this.showHistory(this.props.eq + " " + this.props.date)
          // }
          id="showPantryBtn"
        >
          Donate
        </button> */}
      </div>
    );
  }
}

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
    // this.handleDonDeleteCallback = this.handleDonDeleteCallback.bind(this);
    this.updateExpirations();
    // this.getNotifications();
  }
  updateExpirations() {
    var foods = [];

    axios
      .get("/api/pantryItem/" + localStorage.getItem("username"))
      .then((res) => (foods = res.data))
      .then(() => this.updateExpirationsHelper(foods))
      .then(() => this.getNotifications());
  }

  updateExpirationsHelper(foods) {
    // new Date(year, month, day, hours, minutes, seconds, milliseconds)
    var now = new Date();
    console.log(now);
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
      // console.log(arr);
      console.log(date);
      if (now - date < 0) {
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 1 && food.notification !== "expired") {
          axios
            .post("/api/notificationItem", {
              type: "expired",
              username: food.username,
              food: food.name,
              otherID: food._id,
              donated: 0,
              expiration: exp,
            })
            .then((res) => console.log(res.data));

          axios
            .put("/api/pantryItem/" + food._id + "/expired", {})
            .then((res) => console.log(res.data));
        } else if (diffDays < 4 && food.notification !== "expireSoon") {
          axios
            .post("/api/notificationItem", {
              type: "expireSoon",
              username: food.username,
              food: food.name,
              otherID: food._id,
              donated: 0,
              expiration: exp,
            })
            .then((res) => console.log(res.data));
          axios
            .put("/api/pantryItem/" + food._id + "/expireSoon", {})
            .then((res) => console.log(res.data));
        }
      } else if (food.notification !== "expired") {
        axios
          .post("/api/notificationItem", {
            type: "expired",
            username: food.username,
            food: food.name,
            otherID: food._id,
            donated: 0,
            expiration: exp,
          })
          .then((res) => console.log(res.data));
        axios
          .put("/api/pantryItem/" + food._id + "/expired", {})
          .then((res) => console.log(res.data));
      }
    }
  }
  getNotifications() {
    axios
      .get("/api/notificationItem/" + localStorage.getItem("username"))
      .then((res) =>
        this.setState({
          notifications: res.data,
        })
      );
  }
  //   handleDonDeleteCallback(id) {
  //     console.log(id);
  //     var tempDons = this.state.donations.filter((obj) => obj._id !== id);
  //     this.setState({
  //       donations: tempDons,
  //     });
  //   }
  //   toggleViews() {
  //     this.props.history.push("/pantry");
  //   }
  render() {
    return (
      <div>
        <Navbar />
        <header className="Notification-body">
          <img src={logo} id="logo" />
          <div id="pageHeader">Notifications</div>
          {/* <button onClick={() => this.toggleViews()} id="toggleBtn">
            Toggle
          </button> */}

          {/* <button onClick={() => this.addFood()} id="addFoodBtn">
              Add Food
            </button> */}
          {/* <div id="modal">
              <button onClick={() => this.closePopup()} id="closeModalBtn">
                X
              </button>
              <div id="nameLabel">Food Name:</div>
              <input type="text" className="addPantryInput" id="nameInput" />
              <div id="expirLabel">Expiration Date (mm/dd/yy):</div>
              <input type="text" className="addPantryInput" id="expirInput" />
              <div>
                <button
                  onClick={() => this.submitPantryItem()}
                  id="submitPantryBtn"
                >
                  Submit
                </button>
              </div> 
            </div>*/}
          <div id="notification-container">
            {this.state.notifications.map((notification, i) => (
              <NotificationComponent
                key={i}
                type={notification.type}
                expiration={notification.expiration}
                username={notification.username}
                food={notification.food}
                id={notification._id}
                otherUser={notification.otherUser}
                otherPhone={notification.otherPhone}
                // deleteDonCallback={this.handleDonDeleteCallback}
                // popupCallback={this.handlePopup}
              />
            ))}
          </div>
        </header>
      </div>
    );
  }
}
