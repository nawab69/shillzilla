import React, { Component } from "react";
import Identicon from "identicon.js";
import { NavLink } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-light flex-md-nowrap p-0 shadow text-monospace">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ShillZilla
          {/* <img
            src={onexi}
            height="50"
            className="d-inline-block align-top"
            alt=""
          /> */}
        </a>

        <div className="ul d-flex">
          <div className="li mx-1">
            <NavLink style={{ color: "#6660c5" }} to="/">
              Dashboard
            </NavLink>
          </div>
          <div className="li mx-1">
            <NavLink style={{ color: "#6660c5" }} to="/marketplace">
              Marketplace
            </NavLink>
          </div>
          <div className="li mx-1">
            <NavLink style={{ color: "#6660c5" }} to="/collectable">
              My Collection
            </NavLink>
          </div>
        </div>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>

            {this.props.account ? (
              <img
                className="ml-2"
                width="30"
                height="30"
                src={`data:image/png;base64,${new Identicon(
                  this.props.account,
                  30
                ).toString()}`}
              />
            ) : (
              <span></span>
            )}
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
