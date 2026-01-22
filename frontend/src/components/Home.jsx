import React, { useEffect, useRef, useState } from "react";
import axios from "axios"
import Typed from "typed.js";
import "../stylesheets/style.css";
import TechSphere from "./TechSphere";
import Portfolio from "./Portfolio";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const Home = () => {
  const el = useRef(null);

  // Carousel Refs
  const boxRef = useRef(null);
  const rotY = useRef(0); // Current rotation
  const isDragging = useRef(false);
  const startX = useRef(0);
  const lastRotY = useRef(0);
  const animationRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [words, setWords] = useState(0);
  const [load, setLoad] = useState(false);

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
          // Index is 0-5. In CSS we used --i from 1-6. active logic is same.
          // Base angle for item i: (i + 1) * 60
          const itemAngle = (index + 1) * 60;
          const currentRot = rotY.current;

          // Total effective angle in degrees
          const totalAngle = itemAngle + currentRot;

          // Normalize to -180 to 180
          const normalized = ((totalAngle % 360) + 360) % 360;
          const distFromFront = Math.min(normalized, 360 - normalized); // Distance from 0/360

          // Condition: If within ~75 degrees (covers front 3: 0, +60, -60)
          if (distFromFront < 75) {
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

  // Helper to load HTML template
  const loadTemplate = async (filename) => {
    try {
      const response = await fetch(`/emails/${filename}`);
      return await response.text();
    } catch (error) {
      console.error("Failed to load template:", filename, error);
      return "";
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      // 1. Validate & Save to Backend
      const response = await axios.post("/messages", {
        email,
        name,
        description
      });

      if (response.status === 200 && response.data.success) {
        const { emailjs_config, email_data } = response.data;
        const { service_id, template_id, public_key } = emailjs_config;

        // console.log("EmailJS Config:", { service_id, template_id, public_key }); // Debugging

        // 3. Send User Auto-Reply
        try {
          let userHtml = await loadTemplate("user_auto_reply.html");
          if (userHtml) {
            userHtml = userHtml
              .replace("{{ name }}", email_data.user_name)
              .replace("{{ block_url }}", email_data.block_url)
              .replace("{{ portfolio_url }}", email_data.portfolio_url);

            await emailjs.send(service_id, template_id, {
              to_email: email_data.user_email,
              html: userHtml,
              subject: "We’ve received your message",
              from_name: "Yash Rathore"  // Explicitly set sender name
            }, public_key);
          }
        } catch (err) {
          console.error("Failed to send user email:", err);
          // toast.error("Failed to send auto-reply.");
        }

        // 4. Send Admin Notification
        try {
          let adminHtml = await loadTemplate("admin_notification.html");
          if (adminHtml) {
            const statusClass = email_data.status_type === "NEW" ? "status-new" : "status-responded";

            adminHtml = adminHtml
              .replace("{{ status }}", email_data.status_type)
              .replace("{{ status_class }}", statusClass)
              .replace("{{ name }}", email_data.user_name)
              .replace("{{ email }}", email_data.user_email)
              .replace("{{ message_content }}", email_data.message_content);

            await emailjs.send(service_id, template_id, {
              to_email: email_data.admin_email,
              html: adminHtml,
              subject: `Portfolio: ${email_data.user_name} Try to Connect`
            }, public_key);
          }
        } catch (err) {
          console.error("Failed to send admin email:", err);
        }

        toast.success(response.data.message);
        setEmail("");
        setName("");
        setDescription("");
        setWords(0);

      } else {
        // Handle 200 OK but success=false if that logic existed
                // 2. Clear Form immediately
        setEmail("");
        setName("");
        setDescription("");
        setWords(0);
        toast.success(response.data.message);
      }

      setLoad(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something Went Wrong!");
      setLoad(false);
    }
  };

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
          style={{ position: "relative", overflowX: "hidden" }}
        >
          {/* Foreground Content */}
          <div className="content_overlay">
            <div className="typed_js">
              <div className="text_block">
                <h1>
                  Hi! My name is <span className="name">Yash Rathore</span>
                </h1>
                <div className="sub_text">I am Passionate</div>
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
                <h6>MACHINE LEARNING</h6>
                <img
                  src="./services/ml.jpg"
                  alt="ml"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=ML";
                  }}
                />
              </span>
              <span style={{ "--i": 2 }}>
                <h6>COMPUTER VISION</h6>
                <img
                  src="./services/cv.png"
                  alt="cv"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=CV";
                  }}
                />
              </span>
              <span style={{ "--i": 3 }}>
                <h6>FULL STACK</h6>
                <img
                  src="./services/full.png"
                  alt="fullstack"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=FullStack";
                  }}
                />
              </span>
              <span style={{ "--i": 4 }}>
                <h6>BACKEND DEV</h6>
                <img
                  src="./services/backend.png"
                  alt="backend"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=Backend";
                  }}
                />
              </span>
              <span style={{ "--i": 5 }}>
                <h6>PYTHON DEV</h6>
                <img
                  src="./services/python_opt.png"
                  alt="python"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=Python";
                  }}
                />
              </span>
              <span style={{ "--i": 6 }}>
                <h6>UI/UX DESIGN</h6>
                <img
                  src="./services/ui.png"
                  alt="ui"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300/1a1a1a/c9a035?text=UI/UX";
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
                onSubmit={submitHandler}
              >
                <div className="form_container">
                  <input
                    className="hinput"
                    type="email"
                    placeholder="Enter your email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Enter a valid email address"
                    id="femail"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <input
                    className="hinput"
                    type="text"
                    placeholder="Enter your name"
                    id="fname"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>

                <textarea
                  placeholder="Describe your work"
                  id="fdesc"
                  required
                  value={description}
                  onChange={(e) => {
                    let text = e.target.value;

                    // multiple spaces ko single space banao
                    text = text.replace(/\s+/g, " ");

                    const words =
                      text.trim() === "" ? [] : text.trim().split(" ");

                    if (words.length <= 50) {
                      setDescription(text);
                      setWords(words.length);
                    }
                  }}
                ></textarea>

                <p style={{ textAlign: "right", color: "#ccc" }}>
                  Words: {words}/50
                </p>

                <button
                  id="submitButton"
                  type="submit"
                  style={{ display: "none" }}
                  disabled={load}
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

            <button type="submit" className="send_btn" id="send_btn" form="requestForm" disabled={load}>
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
