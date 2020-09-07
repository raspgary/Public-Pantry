import React, { Component } from "react";
import "../styles/Sell.css";
import axios from "axios";
import Navbar from "./Navbar";
import logo from "../images/pantrytrans2.png";

class SoldComponent extends Component {
  constructor(props) {
    super(props);

    this.deleteSell = this.deleteSell.bind(this);
  }
  deleteSell(id) {
    axios.delete("/api/saleItem/" + id).then((res) => console.log(res.data));
    const { deleteCallback } = this.props;
    deleteCallback(id);
  }

  typeColor() {
    return "3px solid #ffbf5e";
  }

  render() {
    return (
      <div id="sell-comp" style={{ border: this.typeColor() }}>
        <img
          src={require("../images/" + this.props.name + ".png")}
          id="sellPic"
        />

        <div className="ri-container">
          <p className="sellInfo">Product: {this.props.name}</p>
          <p className="sellInfo">Quantity: {this.props.quantity}</p>
          <p className="sellInfo">Price: ${this.props.price}</p>
          <p className="sellInfo">Description: {this.props.description}</p>
          <button
            onClick={() => this.deleteSell(this.props.id)}
            id="deleteSellBtn"
            // className="tryBtn"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

export default class Solds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      soldFoods: [],
    };
    this.handleDeleteCallback = this.handleDeleteCallback.bind(this);
    this.getSoldFoods();
  }

  handleDeleteCallback(id) {
    console.log(id);
    var tempFoods = this.state.soldFoods.filter((obj) => obj._id !== id);
    this.setState({
      soldFoods: tempFoods,
    });
  }

  getSoldFoods() {
    axios.get("/api/saleItem/" + localStorage.getItem("username")).then((res) =>
      this.setState({
        soldFoods: res.data.sort(this.compare),
      })
    );
  }

  compare(a, b) {
    if (a.timeStamp > b.timeStamp) return -1;
    if (b.timeStamp > a.timeStamp) return 1;

    return 0;
  }

  closePopup() {
    var modal = document.getElementById("sellModal");
    modal.style.display = "none";
    var modalB = document.getElementById("modalBlur");
    modalB.style.display = "none";
    document.getElementById("nameInput").value = "";
    document.getElementById("priceInput").value = "";
    document.getElementById("descInput").value = "";
    document.getElementById("quantInput").value = "";
    document.getElementById("filename").innerHTML = "No file chosen";
  }

  sellFood() {
    var modal = document.getElementById("sellModal");
    modal.style.display = "block";
    var modalB = document.getElementById("modalBlur");
    modalB.style.display = "block";
  }

  submitSaleItem() {
    var user = localStorage.getItem("username");
    var longi = localStorage.getItem("longitude");
    var lat = localStorage.getItem("latitude");
    var phone = localStorage.getItem("phone");
    var nam = document.getElementById("nameInput").value;
    var pri = document.getElementById("priceInput").value;
    var desc = document.getElementById("descInput").value;
    var quantity = document.getElementById("quantInput").value;
    var picInput = document.getElementById("picUpload");
    var val = picInput.value.split("\\")[2];
    val = "../images/" + val;
    axios
      .post("/api/saleItem", {
        name: nam,
        price: pri,
        username: user,
        longitude: longi,
        latitude: lat,
        description: desc,
        quantity: quantity,
        phone: phone,
        picture: val,
      })
      .then((res) => console.log(res.data))
      .then(() => this.getSoldFoods());
    this.closePopup();
  }

  handlePopup(name, expiration, id) {
    var dmodal = document.getElementById("sellModal");
    dmodal.style.display = "block";

    var nameL = document.getElementById("foodName");
    nameL.innerHTML = name;
    var expirL = document.getElementById("expirName");
    expirL.innerHTML = expiration;
    this.setState({
      otherID: id,
    });
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
        <header className="SoldFoods-body">
          <img src={logo} id="logo" />

          <div id="pHeader">Your Products</div>
          <button onClick={() => this.sellFood()} id="sellFoodBtn">
            +
          </button>
          <div id="modalBlur"></div>
          <div id="sellModal">
            <button onClick={() => this.closePopup()} id="closeModalBtn">
              X
            </button>
            <div className="label">Food Name:</div>
            <input
              type="text"
              autoComplete="off"
              className="addSaleInput"
              id="nameInput"
            />
            <div className="label">Quantity:</div>
            <input
              type="text"
              autoComplete="off"
              className="addSaleInput"
              id="quantInput"
            />
            <div className="label">Price:</div>
            <input
              type="text"
              autoComplete="off"
              className="addSaleInput"
              id="priceInput"
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
                // style={{color: "tomato"}}
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
              <button onClick={() => this.submitSaleItem()} id="submitSaleBtn">
                Submit
              </button>
            </div>
          </div>
          <div id="sold-container">
            {this.state.soldFoods.map((sold, i) => (
              <SoldComponent
                key={i}
                name={sold.name}
                username={sold.username}
                id={sold._id}
                quantity={sold.quantity}
                picture={sold.picture}
                description={sold.description}
                price={sold.price}
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
