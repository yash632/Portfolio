import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import "../stylesheets/style.css";
import "../stylesheets/respo.css";

const Intract = () => {
  const location = useLocation();
  const footerNav = useRef(null);
  const nav = useRef(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const navEl = nav.current;
    const footerEl = footerNav.current;

    if (!navEl || !footerEl) return;

    if (windowWidth <= 612 && location.pathname === "/message") {
      navEl.style.display = "none";
      footerEl.style.display = "none";
    } else {
      navEl.style.display = "flex";
      footerEl.style.display = "flex";
    }
  }, [windowWidth, location.pathname]);

  useEffect(() => {
    const container = document.querySelector(".container");
    const loading_img = document.querySelector(".loading");

    if (!container || !loading_img) return;

    setTimeout(() => {
      loading_img.style.display = "none";
      container.style.display = "block";
    }, 1490);

    const list = document.querySelectorAll(".list");
    function activeLink() {
      list.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
    }

    list.forEach((item) => item.addEventListener("click", activeLink));
    return () => {
      list.forEach((item) => item.removeEventListener("click", activeLink));
    };
  }, []);

  return (
    <>
      <div className="loading">
        <img
          src="./img/fulllogohb.png"
          alt="HennaBliss logo"
          className="logo_henna"
        />
      </div>

      <div className="container" style={{ display: "none" }}>
        <div className="home">
          <div className="nav_position" ref={nav}>
            <div className="nav">
              <Link to={"/landing"}>
                <div className="logo">
                  <img src="./img/HennaBliss_wordMark.png" height="55" alt="" />
                </div>
              </Link>
              <Link to="/create_post" className="create_post">
                <img src="./img/add.svg" alt="create" />
              </Link>
            </div>
          </div>

          <Outlet />
        </div>

\        <div className="footer_position" ref={footerNav}>
          <footer>
            <nav>
              <ul>
                <li
                  className={`list ${
                    location.pathname === "/home" ? "active" : ""
                  }`}
                >
                  <Link to="/home" className="a">
                    <span className="icon">
                      <img src="./img/home.svg" alt="home" className="invert" />
                    </span>
                    <span className="text">Home</span>
                  </Link>
                </li>

                <li
                  className={`list ${
                    location.pathname === "/message" ? "active" : ""
                  }`}
                >
                  <Link to="/message" className="a">
                    <span className="icon">
                      <img src="./img/msg.svg" alt="message" className="invert" />
                    </span>
                    <span className="text">Message</span>
                  </Link>
                </li>

                <li
                  className={`list ${
                    location.pathname === "/search" ? "active" : ""
                  }`}
                >
                  <Link to="/search" className="a">
                    <span className="icon">
                      <img
                        src="./img/search.svg"
                        alt="search"
                        className="invert"
                      />
                    </span>
                    <span className="text">Search</span>
                  </Link>
                </li>

                <li
                  className={`list ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                >
                  <Link to="/profile" className="a">
                    <span className="icon">
                      <img
                        src="./img/profile.svg"
                        alt="profile"
                        className="invert"
                      />
                    </span>
                    <span className="text">Profile</span>
                  </Link>
                </li>

                <div className="indicator"></div>

                <Link
                  to="/create_post"
                  className="create_post2"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <div>
                    <img src="./img/add.svg" alt="create post" />
                  </div>
                  <Typography
                    style={{
                      textDecoration: "none",
                      color: "black",
                      fontSize: "1vmax",
                      fontWeight: "bolder",
                      fontFamily: "Gilroy-Bold",
                    }}
                  >
                    Post
                  </Typography>
                </Link>

                <Link
                  className="logout_btn"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <div>
                    <img src="./img/logout.svg" alt="logout" />
                  </div>
                  <Typography
                    style={{
                      textDecoration: "none",
                      color: "black",
                      fontSize: "1vmax",
                      fontWeight: "bolder",
                      fontFamily: "Gilroy-Bold",
                    }}
                  >
                    LogOut
                  </Typography>
                </Link>
              </ul>
            </nav>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Intract;
