//import React
import React, { useState } from "react";
//import Link from react router dom
import { Link, useNavigate } from "react-router-dom";

import { useStore as UseUserStore } from "../../stores/user";

export default function navbar() {
  //state toggle
  const [sidebarToggle, setSidebarToggle] = useState(false);

  //function toggle hanlder
  const sidebarToggleHandler = (e) => {
    e.preventDefault();

    if (!sidebarToggle) {
      //add class on body
      document.body.classList.add("sb-sidenav-toggled");

      //set state "sidebarToggle" to true
      setSidebarToggle(true);
    } else {
      //remove class on body
      document.body.classList.remove("sb-sidenav-toggled");

      //set state "sidebarToggle" to false
      setSidebarToggle(false);
    }
  };

  //navigate
  const navigate = useNavigate();

  //method logout
  const { logout } = UseUserStore();

  const logoutHandler = () => {
    logout();
    return navigate("/");
  };

  return (
    <nav
      className="sb-topnav navbar navbar-expand navbar-dark bg-green border-top-yellow shadow-sm fixed-top"
      style={{ paddingLeft: 0, height: "56px", zIndex: "1039" }}
    >
      <a className="navbar-brand ps-3 fw-bold" href="index.html">
        SIBalintan
      </a>
      <button
        className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
        id="sidebarToggle"
        onClick={sidebarToggleHandler}
        href="#!"
      >
        <i className="fas fa-bars"></i>
      </button>

      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></form>
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw"></i>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdown"
          >
            <li>
              <a href="#" className="dropdown-item" onClick={logoutHandler}>
                Logout
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
