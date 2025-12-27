import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../stylesheets/style.css";
import "../stylesheets/respo.css";
import Hero3D from "./Hero3D";

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
          src="./img/yr_logo.png"
          alt="HennaBliss logo"
          className="logo_henna"
        />
      </div>

      <div className="container" style={{ display: "none" }}>
        <Hero3D isMobile={windowWidth <= 768} />
        <div className="home">
          <div className="nav_position" ref={nav}>
            <div className="nav">
              <Link className="sign_link" to={"/landing"}>
                <div className="logo">
                  <span className="logo-signature">Yash Rathore</span>
                </div>
              </Link>
              {/* <Link to="/create_post" className="create_post">
                <img src="./img/add.svg" alt="create" />
              </Link> */}
            </div>
          </div>

          <Outlet />
        </div>

        <div className="footer_position" ref={footerNav}>
          <footer>
            <nav>
              <ul>
                <li className={`list ${location.pathname === "/home" ? "active" : ""}`}>
                  <Link to="/home" className="a">
                    <span className="icon">
                      <ion-icon name="home-outline"></ion-icon>
                    </span>
                    <span className="text">Home</span>
                  </Link>
                </li>

                <li className={`list ${location.pathname === "/about" ? "active" : ""}`}>
                  <Link to="/about" className="a">
                    <span className="icon">
                      <ion-icon name="information-circle-outline"></ion-icon>
                    </span>
                    <span className="text">About</span>
                  </Link>
                </li>

                <li className={`list ${location.pathname === "/resume" ? "active" : ""}`}>
                  <Link to="/resume" className="a">
                    <span className="icon">
                      <ion-icon name="document-text-outline"></ion-icon>
                    </span>
                    <span className="text">Resume</span>
                  </Link>
                </li>

                <li className={`list ${location.pathname === "/project" ? "active" : ""}`}>
                  <Link to="/project" className="a">
                    <span className="icon">
                      <ion-icon name="code-outline"></ion-icon>
                    </span>
                    <span className="text">Projects</span>
                  </Link>
                </li>

                <li className={`list ${location.pathname === "/contact" ? "active" : ""}`}>
                  <Link to="/contact" className="a">
                    <span className="icon">
                      <ion-icon name="call-outline"></ion-icon>
                    </span>
                    <span className="text">Contact</span>
                  </Link>
                </li>

                <div className="indicator"></div>
              </ul>
            </nav>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Intract;
