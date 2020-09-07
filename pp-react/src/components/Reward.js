import React, { Component } from "react";
import "../styles/Reward.css";
import Navbar from "./Navbar";
import logo from "../images/pantrytrans2.png";
import tentree from "../images/tentree.jpg";
import allbirds from "../images/allbirds.jpg";
import patagonia from "../images/patagonia.jpg";
import costco from "../images/costco.jpg";
import wholefoods from "../images/wholefoods.png";
import kroger from "../images/kroger.png";
import ffh from "../images/ffh.jpg";
import foodbank from "../images/foodbank.jpg";
import aah from "../images/aah.jpg";
import ocean from "../images/ocean.png";
import rainforest from "../images/rainforest.jpg";
import teamtree from "../images/teamtress.png";
var ProgressBar = require("progressbar.js");

export default class Reward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rewards: localStorage.getItem("rewards"),
    };
  }
  renderMath() {
    // var mathL = document.getElementById("mathlabel");
    if (this.state.rewards > 250) {
      return "Congrats! You may claim a prize!";
    } else {
      return 250 - this.state.rewards + " more points until your next prize!";
    }
  }

  tryBuy() {
    if (this.state.rewards < 250) {
      alert("You don't have enough points");
    }
  }

  renderProgressBar() {
    var bar = new ProgressBar.Line("#progressbar", {
      strokeWidth: 1,
      easing: "easeInOut",
      duration: 1400,
      color: "#9adac3",
      trailColor: "#eee",
      trailWidth: 1,
      svgStyle: { width: "100%", height: "100%" },
      text: {
        style: {
          // Text color.
          // Default: same as stroke color (options.color)
          color: "#000000",
          position: "absolute",
          right: "0",
          top: "40px",
          padding: "30px",
          margin: 0,
          transform: null,
        },
        autoStyleContainer: false,
      },
      from: { color: "#FFEA82" },
      to: { color: "#ED6A5A" },
      step: (state, bar) => {
        if (this.state.rewards <= 2500) {
          bar.setText(Math.round(bar.value() * 250) + "/250");
        } else {
          bar.setText(this.state.rewards + "/2500");
        }
      },
    });
    if (this.state.rewards > 2500) {
      // bar.setValue(rewards);
      bar.animate(1.0);
    } else {
      bar.animate(this.state.rewards / 250);
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <header className="Reward-body">
          <img src={logo} id="logo" />
          <div id="pageHeader">Rewards</div>
          <div id="rewardwrapper">
            <div className="points" id="rewardlabel">
              Rewards Points:
            </div>
            <div id="mathlabel">{this.renderMath()}</div>
            <div id="progressbar"></div>
          </div>
          <div className="roww">
            <div className="giftcard">
              <div className="giftname">$25 Food For the Hungry Donation</div>

              <img className="giftpic" src={ffh} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="donateBtn">
                Donate
              </button>
            </div>
            <div className="giftcard">
              <div className="giftname">$25 FoodBank of Waterloo Donation</div>
              <img className="giftpic" src={foodbank} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="donateBtn">
                Donate
              </button>
            </div>
            <div className="giftcard">
              <div className="giftname">$25 Action Against Hunger Donation</div>
              <img className="giftpic" src={aah} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="donateBtn">
                Donate
              </button>
            </div>
          </div>
          <div className="roww">
            <div className="giftcard">
              <div className="giftname">$15 Tentree Gift Card</div>

              <img className="giftpic" src={tentree} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="giftbtn">
                Order
              </button>
            </div>
            <div className="giftcard">
              <div className="giftname">$15 Allbirds Gift Card</div>
              <img className="giftpic" src={allbirds} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="giftbtn">
                Order
              </button>
            </div>
            <div className="giftcard">
              <div className="giftname">$15 Patagonia Gift Card</div>
              <img className="giftpic" src={patagonia} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="giftbtn">
                Order
              </button>
            </div>
          </div>
          <div className="roww">
            <div className="giftcard">
              <div className="giftname">$25 Ocean Conservacy Donation</div>

              <img className="giftpic" src={ocean} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="donateBtn">
                Donate
              </button>
            </div>
            <div className="giftcard">
              <div className="giftname">$25 Rainforest Alliance Donation</div>
              <img className="giftpic" src={rainforest} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="donateBtn">
                Donate
              </button>
            </div>
            <div className="giftcard">
              <div className="giftname">$25 #TeamTrees Donation</div>
              <img className="giftpic" src={teamtree} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="donateBtn">
                Donate
              </button>
            </div>
          </div>
          <div className="roww">
            <div className="giftcard">
              <div className="giftname">$15 Costco Gift Card</div>

              <img className="giftpic" src={costco} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="giftbtn">
                Order
              </button>
            </div>
            <div className="giftcard">
              <div className="giftname">$15 Whole Foods Gift Card</div>
              <img className="giftpic" src={wholefoods} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="giftbtn">
                Order
              </button>
            </div>
            <div className="giftcard">
              <div className="giftname">$15 Kroger Gift Card</div>
              <img className="giftpic" src={kroger} />
              <div className="giftname">250 points</div>
              <button onClick={() => this.tryBuy()} className="giftbtn">
                Order
              </button>
            </div>
          </div>
        </header>
      </div>
    );
  }
  componentDidMount() {
    // this.renderMath();
    this.renderProgressBar();
  }
}
