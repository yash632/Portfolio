import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

const Home = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Web Developer", "UI/UX Designer", "Software Engineer"],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 1000,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Hello, I'm <span className="highlight">Your Name</span></h1>
          <h2 className="typing-text">I am a <span ref={el}></span></h2>
          <p className="description">
            Passionate about creating futuristic and interactive web experiences.
          </p>
        </div>
        <div className="hero-image">
          {/* Placeholder for user photo */}
          <div className="image-placeholder">
            <ion-icon name="person-circle-outline"></ion-icon>
          </div>
        </div>
      </section>

      <section className="projects-section">
        <h2 className="section-title">My Projects</h2>
        <div className="carousel-container">
           {/* Project items will go here */}
           <div className="project-card neon-border">
              <h3>Project 1</h3>
              <p>Description of project 1.</p>
           </div>
           <div className="project-card neon-border">
              <h3>Project 2</h3>
              <p>Description of project 2.</p>
           </div>
           <div className="project-card neon-border">
              <h3>Project 3</h3>
              <p>Description of project 3.</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
