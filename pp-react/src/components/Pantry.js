import React, { Component } from "react";
import "../styles/Pantry.css";
// import { Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import logo from "../images/pantrytrans2.png";

class PantryComponent extends Component {
  constructor(props) {
    super(props);
    this.deletePantry = this.deletePantry.bind(this);
  }
  deletePantry(id) {
    axios.delete("/api/pantryItem/" + id).then((res) => console.log(res.data));
    const { deleteCallback } = this.props;
    deleteCallback(id);
  }

  donate(name, expiration, id) {
    const { popupCallback } = this.props;
    popupCallback(name, expiration, id);
  }

  getBorder() {
    var now = new Date();
    var arr = this.props.expiration.split("/");
    var date = new Date(
      parseInt("20" + arr[2], 10),
      parseInt(arr[0], 10) - 1,
      parseInt(arr[1], 10),
      0,
      0,
      0,
      0
    );
    if (now - date < 0) {
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 1) {
        return "3px solid #fd9696";
      } else if (diffDays < 4) {
        return "3px solid #fdfd96";
      } else {
        return "3px solid #77dd77";
      }
    } else {
      return "3px solid #fd9696";
    }
  }

  render() {
    return (
      <div id="pantry-comp" style={{ border: this.getBorder() }}>
        <p className="pantryInfo" id="info1">
          Food Item: {this.props.name}
        </p>
        <p className="pantryInfo" id="info2">
          Expiration Date: {this.props.expiration}
        </p>

        <button
          onClick={() => this.deletePantry(this.props.id)}
          id="deletePantryBtn"
        >
          X
        </button>
        <button
          onClick={() =>
            this.donate(this.props.name, this.props.expiration, this.props.id)
          }
          id="showPantryBtn"
        >
          Donate
        </button>
      </div>
    );
  }
}

export default class Pantry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foods: [],
      otherID: "",
    };
    this.handleDeleteCallback = this.handleDeleteCallback.bind(this);
    this.handlePopup = this.handlePopup.bind(this);
    this.deletePantryItem = this.deletePantryItem.bind(this);
    this.getFoods();
  }

  handleDeleteCallback(id) {
    console.log(id);
    var tempFoods = this.state.foods.filter((obj) => obj._id !== id);
    this.setState({
      foods: tempFoods,
    });
  }

  getFoods() {
    axios
      .get("/api/pantryItem/" + localStorage.getItem("username"))
      .then((res) =>
        this.setState({
          foods: res.data,
        })
      );
  }

  closePopup() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
    var dModal = document.getElementById("donateModal");
    dModal.style.display = "none";
    var modalB = document.getElementById("modalBlur");
    modalB.style.display = "none";

    document.getElementById("filename").innerHTML = "No file chosen";
    document.getElementById("nameInput").value = "";
    document.getElementById("expirInput").value = "";
    document.getElementById("quantityInput").value = "";
    document.getElementById("descInput").value = "";
  }

  addFood() {
    var modal = document.getElementById("modal");
    modal.style.display = "block";
    var modalB = document.getElementById("modalBlur");
    modalB.style.display = "block";
  }

  submitPantryItem() {
    var user = localStorage.getItem("username");
    var nam = document.getElementById("nameInput").value;
    var expir = document.getElementById("expirInput").value;
    axios
      .post("/api/pantryItem", {
        name: nam,
        expiration: expir,
        username: user,
        notification: "",
      })
      .then((res) => console.log(res.data))
      .then(() => this.updateExpirations())
      .then(() => this.getFoods());
    this.closePopup();
  }
  updateExpirations() {
    var foods = [];

    axios
      .get("/api/pantryItem/" + localStorage.getItem("username"))
      .then((res) => (foods = res.data))
      .then(() => this.updateExpirationsHelper(foods));
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

  toggleViews() {
    this.props.history.push("/donate");
  }

  handlePopup(name, expiration, id) {
    var dmodal = document.getElementById("donateModal");
    dmodal.style.display = "block";
    var modalB = document.getElementById("modalBlur");
    modalB.style.display = "block";

    var nameL = document.getElementById("foodName");
    nameL.innerHTML = name;
    var expirL = document.getElementById("expirName");
    expirL.innerHTML = expiration;
    this.setState({
      otherID: id,
    });
  }

  deletePantryItem(id) {
    axios
      .delete("/api/pantryItem/" + id)
      .then((res) => console.log(res.data))
      .then(() => this.toggleViews());
  }

  submitDonateItem() {
    var user = localStorage.getItem("username");
    var longi = localStorage.getItem("longitude");
    var lat = localStorage.getItem("latitude");
    var user = localStorage.getItem("username");
    var phone = localStorage.getItem("phone");
    var nam = document.getElementById("foodName").innerHTML;
    var expir = document.getElementById("expirName").innerHTML;
    var desc = document.getElementById("descInput").value;
    var quantity = document.getElementById("quantityInput").value;
    var picInput = document.getElementById("picUpload");
    var val = picInput.value.split("\\")[2];
    val = "../images/" + val;
    axios
      .post("/api/donateItem", {
        name: nam,
        expiration: expir,
        username: user,
        longitude: longi,
        latitude: lat,
        description: desc,
        quantity: quantity,
        phone: phone,
        picture: val,
      })
      .then((res) => console.log(res.data));

    this.deletePantryItem(this.state.otherID);
    this.setState({
      otherID: "",
    });
    this.closePopup();
  }
  printPath() {
    var picInput = document.getElementById("picUpload");
    var val = picInput.value.split("\\")[2];
    var fileLabel = document.getElementById("filename");
    fileLabel.innerHTML = val;
  }

  render() {
    return (
      <div>
        <Navbar />
        <header className="Pantry-body">
          <img src={logo} id="logo" />
          <div id="pantrytop-container">
            <div id="pageHeader">Pantry</div>
            <div onClick={() => this.toggleViews()} id="toggleOrderedBtn">
              <div id="outer1Toggle">Donations</div>
              <div id="inner1Toggle">Pantry</div>
            </div>
            <button onClick={() => this.addFood()} id="addFoodBtn">
              +
            </button>
          </div>

          <div id="modalBlur"></div>
          <div id="modal">
            <button onClick={() => this.closePopup()} id="closeModalBtn">
              X
            </button>
            <div style={{ "margin-top": "6vh" }}>
              <div className="label">Food Name:</div>
              <input
                type="text"
                autoComplete="off"
                className="addPantryInput"
                id="nameInput"
              />
              <div className="label">Expiration Date (mm/dd/yy):</div>
              <input
                type="text"
                autoComplete="off"
                className="addPantryInput"
                id="expirInput"
              />
              <div>
                <button
                  onClick={() => this.submitPantryItem()}
                  id="submitPantryBtn"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div id="donateModal">
            <button onClick={() => this.closePopup()} id="closeModalBtn">
              X
            </button>
            <div style={{ "margin-top": "6vh" }}>
              <div className="label">Food Name:</div>
              <div
                className="label"
                id="foodName"
                style={{ "font-weight": "bold" }}
              ></div>
              <div className="label">Expiration Date (mm/dd/yy):</div>
              <div
                className="label"
                id="expirName"
                style={{ "font-weight": "bold" }}
              ></div>
              <div className="label">Quantity:</div>
              <input
                type="text"
                autoComplete="off"
                className="addPantryInput"
                id="quantityInput"
              />
              <div className="label">Description:</div>
              <textarea id="descInput" cols="40" rows="5"></textarea>

              <div>
                <input
                  type="file"
                  // autoComplete="off"
                  className="addPic"
                  id="picUpload"
                  accept=".PNG,.png,.jpg,.jpeg"
                  onChange={() => this.printPath()}
                ></input>
                <button
                  for="picUpload"
                  id="fileB"
                  onClick={() => document.getElementById("picUpload").click()}
                >
                  Choose File
                </button>
                <p id="filename">No file chosen</p>
              </div>
              <div>
                <button
                  onClick={() => this.submitDonateItem()}
                  id="submitDonateBtn"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div id="pantry-container">
            {this.state.foods.map((food, i) => (
              <PantryComponent
                key={i}
                name={food.name}
                expiration={food.expiration}
                username={food.username}
                id={food._id}
                notification={food.notification}
                deleteCallback={this.handleDeleteCallback}
                popupCallback={this.handlePopup}
              />
            ))}
          </div>
        </header>
      </div>
    );
  }
}
