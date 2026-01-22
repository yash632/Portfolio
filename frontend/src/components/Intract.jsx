import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../stylesheets/style.css";
import "../stylesheets/respo.css";
import Hero3D from "./Hero3D";

// Import Page Components for Keep-Alive
import Home from "./Home";
import About from "./About";
import Resume from "./Resume";
import Project from "./Project";
import Contact from "./Contact";

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

  // Helper to check if a route is active (simple includes check or exact match)
  const isRoute = (route) => {
    if (route === '/home') return location.pathname === '/home' || location.pathname === '/';
    return location.pathname === route;
  };

  return (
    <>
      <div className="loading">
        <img
          src="./img/yr_logo.webp"
          alt="signature_image"
          className="logo_sign"
        />
      </div>

      <div className="container" style={{ display: "none" }}>
        <Hero3D isMobile={windowWidth <= 768} />
        <div className="home">
          <div className="nav_position" ref={nav}>
            <div className="nav">
              <Link className="sign_link" to={"/home"}>
                <div className="logo">
                  <span className="logo-signature">Yash Rathore</span>
                </div>
              </Link>
            </div>
          </div>

          {/* KEEP ALIVE IMPLEMENTATION: Render all, hide inactive */}
          {/* <div style={{ display: isRoute('/home') ? 'block' : 'none' }}>
            <Home />
          </div>
          <div style={{ display: isRoute('/about') ? 'block' : 'none' }}>
            <About />
          </div>*/}
          <div style={{ display: isRoute('/project') ? 'block' : 'none' }}>
            <Project />
          </div>
          {/* <div style={{ display: isRoute('/resume') ? 'block' : 'none' }}>
            <Resume />
          </div>
          <div style={{ display: isRoute('/contact') ? 'block' : 'none' }}>
            <Contact />
          </div>  */}
<Outlet/>
        </div>

        <div className="footer_position" ref={footerNav}>
          <footer className="nav_footer">
            <nav>
              <ul>
                <li className={`list ${isRoute("/home") ? "active" : ""}`}>
                  <Link to="/home" className="a">
                    <span className="icon">
                      <ion-icon name="home-outline"></ion-icon>
                    </span>
                    <span className="text">Home</span>
                  </Link>
                </li>

                <li className={`list ${isRoute("/about") ? "active" : ""}`}>
                  <Link to="/about" className="a">
                    <span className="icon">
                      <ion-icon name="information-circle-outline"></ion-icon>
                    </span>
                    <span className="text">About</span>
                  </Link>
                </li>

                <li className={`list ${isRoute("/project") ? "active" : ""}`}>
                  <Link to="/project" className="a">
                    <span className="icon">
                      <ion-icon name="code-outline"></ion-icon>
                    </span>
                    <span className="text">Projects</span>
                  </Link>
                </li>

                <li className={`list ${isRoute("/resume") ? "active" : ""}`}>
                  <Link to="/resume" className="a">
                    <span className="icon">
                      <ion-icon name="document-text-outline"></ion-icon>
                    </span>
                    <span className="text">Resume</span>
                  </Link>
                </li>

                <li className={`list ${isRoute("/contact") ? "active" : ""}`}>
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
