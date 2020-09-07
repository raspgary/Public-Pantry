import React, { Component } from "react";
import "../styles/Feed.css";
import axios from "axios";
import Navbar from "./Navbar";
import logo from "../images/pantrytrans2.png";

class FeedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "buy",
      imgUrl: "",
    };

    this.typeDef();
  }

  componentDidMount() {
    if (this.props.expiration !== undefined) {
      this.setState({ type: "claim" });
    }
  }

  typeDef() {
    if (this.props.expiration !== undefined) {
      return "claim";
    }
    return "buy";
  }

  typeColor() {
    if (this.props.expiration !== undefined) {
      return "3px solid #77dd77";
    }
    return "3px solid #ffbf5e";
  }

  backColor() {
    if (this.props.expiration !== undefined) {
      return "#77dd77";
    }
    return "#ffbf5e";
  }

  displayExp() {
    if (this.props.expiration === undefined) {
      return "none";
    }
    return "block";
  }

  displayPrice() {
    if (this.props.expiration !== undefined) {
      return "none";
    }
    return "block";
  }

  performAction() {
    var username = localStorage.getItem("username");
    var otherUser = this.props.username;
    var foodName = this.props.name;
    var phoneN = this.props.phone;

    axios
      .post("/api/notificationItem", {
        type: "ordered",
        food: foodName,
        username: username,
        otherUser: otherUser,
        otherPhone: phoneN,
      })
      .then((res) => console.log(res.data));

    const { getDonateFeed } = this.props;

    axios
      .post("/api/notificationItem", {
        type: "order",
        food: foodName,
        username: otherUser,
        otherUser: username,
        otherPhone: localStorage.getItem("phone"),
      })
      .then((res) => console.log(res.data));

    if (this.state.type === "buy") {
      axios
        .delete("/api/saleItem/" + this.props.id)
        .then((res) => console.log(res.data))
        .then(() => getDonateFeed());
      axios
        .put("/api/userItem/" + username, {})
        .then((res) => console.log(res.data));
    } else {
      axios
        .delete("/api/donateItem/" + this.props.id)
        .then((res) => console.log(res.data))
        .then(() => getDonateFeed());
      axios
        .put("/api/userItem/" + username, {})
        .then((res) => console.log(res.data));
      axios
        .put("/api/userItem/" + otherUser, {})
        .then((res) => console.log(res.data));
    }
    localStorage.setItem(
      "rewards",
      parseInt(localStorage.getItem("rewards")) + 20
    );
  }

  calculateDistance() {
    var lat1 = this.props.latitude;
    var lon1 = this.props.longitude;

    var lat2 = localStorage.getItem("latitude");
    var lon2 = localStorage.getItem("longitude");

    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;

    return Math.round(dist * 10.0 * 0.8684) / 10.0 + " miles";
  }

  render() {
    return (
      <div id="feed-comp" style={{ border: this.typeColor() }}>
        <img
          src={require("../images/" + this.props.name + ".png")}
          id="foodPic"
        />

        <div className="right-container">
          <p className="feedInfo">Seller: {this.props.username}</p>
          <p className="feedInfo">Product: {this.props.name}</p>
          <p className="feedInfo">Quantity: {this.props.quantity}</p>
          <p
            id="priceInfo"
            className="feedInfo"
            style={{ display: this.displayPrice() }}
          >
            Price: ${this.props.price}
          </p>
          <p
            id="expInfo"
            className="feedInfo"
            style={{ display: this.displayExp() }}
          >
            Expiration Date: {this.props.expiration}
          </p>
          <p className="feedInfo">Description: {this.props.description}</p>
          <p className="feedInfo">Distance Away: {this.calculateDistance()}</p>
          <button
            onClick={() => this.performAction()}
            style={{ background: this.backColor() }}
            id="actionBtn"
            // className="tryBtn"
          >
            {this.typeDef()}
          </button>
        </div>

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

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saleItems: [],
      donateItems: [],
      allItems: [],
      shownItems: [],
    };
    // this.handleDeleteCallback = this.handleDeleteCallback.bind(this);
    // this.handlePopup = this.handlePopup.bind(this);
    // this.deletePantryItem = this.deletePantryItem.bind(this);
    this.getDonateFeed = this.getDonateFeed.bind(this);
    this.updateExpirations();
    this.updateDonations();
    this.getDonateFeed();
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

  // handleDeleteCallback(id) {
  //   console.log(id);
  //   var tempFoods = this.state.foods.filter((obj) => obj._id !== id);
  //   this.setState({
  //     foods: tempFoods,
  //   });
  // }

  getDonateFeed() {
    axios
      .get("/api/donateItem")
      .then((res) =>
        this.setState({
          donateItems: res.data,
        })
      )
      .then(() => this.getSaleFeed());
  }

  getSaleFeed() {
    axios
      .get("/api/saleItem")
      .then((res) =>
        this.setState({
          saleItems: res.data,
        })
      )
      .then(() => this.getFeed());
  }

  getFeed() {
    var temp = [...this.state.saleItems, ...this.state.donateItems];
    temp.sort(this.compare);

    temp = temp.filter(
      (element) => element.username != localStorage.getItem("username")
    );

    this.setState({
      allItems: temp,
      shownItems: temp,
    });
  }

  compare(a, b) {
    if (a.timeStamp > b.timeStamp) return -1;
    if (b.timeStamp > a.timeStamp) return 1;

    return 0;
  }

  closePopup() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
    var modal = document.getElementById("donateModal");
    modal.style.display = "none";
  }

  addFood() {
    var modal = document.getElementById("modal");
    modal.style.display = "block";
    // var info = document.getElementById("historyInfo");
    // info.innerHTML = res;
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
      })
      .then((res) => console.log(res.data));
    this.closePopup();
    this.getFoods();
  }

  toggleViews() {
    this.props.history.push("/donate");
  }

  handlePopup(name, expiration, id) {
    var dmodal = document.getElementById("donateModal");
    dmodal.style.display = "block";

    var nameL = document.getElementById("foodName");
    nameL.innerHTML = name;
    var expirL = document.getElementById("expirName");
    expirL.innerHTML = expiration;
    this.setState({
      otherID: id,
    });
  }

  deletePantryItem(id) {
    axios.delete("/api/pantryItem/" + id).then((res) => console.log(res.data));
    this.toggleViews();
    // this.handleDeleteCallback(id);
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
      })
      .then((res) => console.log(res.data));

    this.deletePantryItem(this.state.otherID);
    this.setState({
      otherID: "",
    });
    this.closePopup();
  }

  onFocus = () => {
    var search = document.getElementById("search");
    // console.log("here");
    if (search.value === "Search") {
      search.value = "";
    }
  };
  onBlur = () => {
    var search = document.getElementById("search");
    // console.log("here");
    if (search.value === "") {
      search.value = "Search";
    }
  };

  onChange = () => {
    var search = document.getElementById("search");
    console.log(search.value);
    var temp = this.state.allItems.filter((obj) =>
      obj.name.includes(search.value)
    );
    this.setState({
      shownItems: temp,
    });
  };

  render() {
    return (
      <div>
        <Navbar />
        <header className="Feed-body">
          <img src={logo} id="logo" />
          <div id="pageHeader">Marketplace</div>
          <input
            type="text"
            id="search"
            defaultValue="Search"
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()}
            onChange={() => this.onChange()}
            autoComplete="off"
          />
          <div id="feed-container">
            {this.state.shownItems.map((sold, i) => (
              <FeedComponent
                key={i}
                name={sold.name}
                username={sold.username}
                id={sold._id}
                quantity={sold.quantity}
                picture={sold.picture}
                description={sold.description}
                price={sold.price}
                // deleteCallback={this.handleDeleteCallback}
                // popupCallback={this.handlePopup}
                expiration={sold.expiration}
                phone={sold.phone}
                picture={sold.picture}
                getDonateFeed={this.getDonateFeed}
                longitude={sold.longitude}
                latitude={sold.latitude}
              />
            ))}
            {/* {this.state.donateItems.map((sold, i) => (
                <FeedComponent
                  key={i}
                  name={sold.name}
                  username={sold.username}
                  id={sold._id}
                  quantity={sold.quantity}
                  picture={sold.picture}
                  description={sold.description}
                  price={sold.price}
                  // deleteCallback={this.handleDeleteCallback}
                  // popupCallback={this.handlePopup}
                  expiration = {sold.expiration}
                />
                ))} */}
          </div>
        </header>
      </div>
    );
  }
}
