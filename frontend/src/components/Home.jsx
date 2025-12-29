import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import "../stylesheets/style.css";
import TechSphere from "./TechSphere";
import Portfolio from "./Portfolio";

const Home = () => {
  const el = useRef(null);

  // Carousel Refs
  const boxRef = useRef(null);
  const rotY = useRef(0); // Current rotation
  const isDragging = useRef(false);
  const startX = useRef(0);
  const lastRotY = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    // Typed.js initialization
    const typed = new Typed(el.current, {
      strings: [
        "Web Developer",
        "Machine Learning Engineer",
        "Data Science Engineer",
        "AI & Computer Vision Developer",
      ],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 1000,
      loop: true,
    });

    // Carousel Animation Loop
    const updateRotation = () => {
      if (!isDragging.current && boxRef.current) {
        // Auto-rotation when not dragging
        rotY.current += 0.2; // Adjust speed here
      }

      if (boxRef.current) {
        const box = boxRef.current;
        box.style.transform = `perspective(1000px) rotateX(-5deg) rotateY(${rotY.current}deg)`;

        // Calculate visibility for titles (Front 3 items)
        Array.from(box.children).forEach((child, index) => {
          // Index is 0-7. In CSS we used --i from 1-8. active logic is same.
          // Base angle for item i: (i + 1) * 45
          const itemAngle = (index + 1) * 45;
          const currentRot = rotY.current;

          // Total effective angle in degrees
          const totalAngle = itemAngle + currentRot;

          // Normalize to -180 to 180
          const normalized = ((totalAngle % 360) + 360) % 360;
          const distFromFront = Math.min(normalized, 360 - normalized); // Distance from 0/360

          // Condition: If within ~67.5 degrees (covers front 3: 0, +45, -45)
          if (distFromFront < 60) {
            child.classList.add("active");
          } else {
            child.classList.remove("active");
          }
        });
      }

      animationRef.current = requestAnimationFrame(updateRotation);
    };

    animationRef.current = requestAnimationFrame(updateRotation);

    return () => {
      typed.destroy();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Drag Handlers
  const handleStart = (clientX) => {
    isDragging.current = true;
    startX.current = clientX;
    lastRotY.current = rotY.current;
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;
    const deltaX = clientX - startX.current;
    // Sensitivity factor (0.5 means 1px moved = 0.5deg rotated)
    rotY.current = lastRotY.current + deltaX * 0.5;
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  // Mouse Events
  const onMouseDown = (e) => handleStart(e.clientX);
  const onMouseMove = (e) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => handleEnd();

  // Touch Events
  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  return (
    <div className="mcontainer">
      <section id="home" className="section active">
        <div
          className="front_content"
          style={{ position: "relative", overflow: "hidden" }}
        >
          {/* Foreground Content */}
          <div className="content_overlay">
            <div className="typed_js">
              <div className="text_block">
                <h1>
                  Hi! My name is <span className="name">Yash Rathore</span>
                </h1>
                <div className="sub_text">I am Passionate about</div>
                <span ref={el} className="typing_text"></span>
              </div>
            </div>

            <div className="dev_img">
              <img
                src="/img/hero_profile.webp"
                alt="myImg"
                className="my_img"
              />
            </div>
          </div>
        </div>
        {/* front_content */}

        <div className="second_content">
          <div className="second_head">
            My <span className="name">Services</span>
          </div>
          <div className="img_active">
            <div className="img_active_data"></div>
          </div>

          {/* INTERACTIVE CAROUSEL CONTAINER */}
          <div
            className="box_body"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ cursor: "grab" }} // inline as backup
          >
            <div className="box" ref={boxRef}>
              <span style={{ "--i": 1 }}>
                <h6>PROJECTS</h6>
                <img
                  src="./img/img1.webp"
                  alt="p1"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=Project+1";
                  }}
                />
              </span>
              <span style={{ "--i": 2 }}>
                <h6>PROJECTS</h6>
                <img
                  src="./img/img2.webp"
                  alt="p2"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=Project+2";
                  }}
                />
              </span>
              <span style={{ "--i": 3 }}>
                <h6>PROJECTS</h6>
                <img
                  src="./img/img3.webp"
                  alt="p3"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=Project+3";
                  }}
                />
              </span>
              <span style={{ "--i": 4 }}>
                <h6>PROJECTS</h6>
                <img
                  src="./img/img5.webp"
                  alt="p4"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=Project+4";
                  }}
                />
              </span>
              <span style={{ "--i": 5 }}>
                <h6>PROJECTS</h6>
                <img
                  src="./img/img4.webp"
                  alt="p5"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=Project+5";
                  }}
                />
              </span>
              <span style={{ "--i": 6 }}>
                <h6>PROJECTS</h6>
                <img
                  src="./img/img6.webp"
                  alt="p6"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=Project+6";
                  }}
                />
              </span>
              <span style={{ "--i": 7 }}>
                <h6>PROJECTS</h6>
                <img
                  src="./img/img7.webp"
                  alt="p7"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=Project+7";
                  }}
                />
              </span>
              <span style={{ "--i": 8 }}>
                <h6>PROJECTS</h6>
                <img
                  src="./img/img8.webp"
                  alt="p8"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=Project+8";
                  }}
                />
              </span>
            </div>
          </div>
        </div>
        {/* second_content */}

        <div className="third_content">
          <div className="third_img">
            {/* <img src="./img/ai_mind.png" alt="AI Mind" className="my_img3" /> */}
            <TechSphere />
          </div>

          <div className="third_text">
            <div>
              <span>Why</span>
              <span className="name"> Hire me?</span>
            </div>
            <div className="p">
              I build real, working AI-powered products, not just demos. From
              computer vision systems to full-stack web apps, I turn ideas into
              scalable solutions. If you need someone who can think, build, and
              ship end-to-end, I’m the one you don’t want to miss.
            </div>
          </div>
        </div>
        {/* third_content */}

        <div className="port_text">
          <div>Lets have a look at</div>
          <div>
            My <span className="name">Portfolio</span>
          </div>
        </div>

        <div className="fourth_content">
          <Portfolio />
        </div>
        {/* fourth_content */}

        <div className="fifth_content">
          <div>Have an Awesome Project</div>
          <div>
            Idea? <span className="name">Let's Discuss</span>
          </div>
        </div>

        <div className="con_footer">
          <div className="footer_text">
            <div>Lets Connect there</div>
          </div>
          <div className="footer_content">
            <div className="send_box">
              <form
                className="send_form"
                id="requestForm"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="form_container">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    id="femail"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    id="fname"
                    required
                  />
                </div>

                <textarea
                  placeholder="Describe your work"
                  id="fdesc"
                  required
                ></textarea>
                <p id="wordCount" style={{ textAlign: "right", color: "#ccc" }}>
                  Words: 0/50
                </p>
                <button
                  id="submitButton"
                  type="submit"
                  style={{ display: "none" }}
                >
                  Submit
                </button>
              </form>
              <h6
                className="h6"
                style={{ color: "#db0000", textAlign: "center" }}
              >
                Please note: You can only send one message until a response is
                received.
                <p style={{ color: "white" }}>Thank You!</p>
              </h6>
            </div>

            <button className="send_btn" id="send_btn">
              <div>S</div>
              <div>E</div>
              <div>N</div>
              <div>D</div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
