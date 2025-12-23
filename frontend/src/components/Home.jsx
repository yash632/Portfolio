import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import "../stylesheets/style.css";
import Hero3D from "./Hero3D";

const Home = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Web Developer", "Programmer", "Tech enthusiast"],
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
    <div className="mcontainer">
      <section id="home" className="section active">
        <div className="front_content" style={{ position: 'relative', overflow: 'hidden' }}>
          
          {/* 3D Background */}
          <Hero3D />

          {/* Foreground Content */}
          <div className="content_overlay" style={{ zIndex: 2, display: 'flex', width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
            <div className="dev_img" style={{ display: 'none' }}> 
              {/* Hidden static image, preserved just in case */}
              <img src="./img/my_img4.png" alt="myImg" className="my_img" onError={(e) => {e.target.style.display='none'}} />
            </div>

            <div className="typed_js">
              <div className="text_block">
                <h1>Hi! My name is <span className="name">Yash Rathore</span></h1>
                <div className="sub_text">I am Passionate about</div>
                <span ref={el} className="typing_text"></span>
              </div>
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

          <div className="box_body">
            <div className="box">
              <span style={{ "--i": 1 }}>
                <img src="./img/img1.jpg" alt="p1" onError={(e) => {e.target.src='https://placehold.co/300/1a1a1a/c9a035?text=Project+1'}} />
                <h6>PROJECTS</h6>
              </span>
              <span style={{ "--i": 2 }}>
                <img src="./img/img2.jpg" alt="p2" onError={(e) => {e.target.src='https://placehold.co/300/1a1a1a/c9a035?text=Project+2'}} />
                <h6>PROJECTS</h6>
              </span>
              <span style={{ "--i": 3 }}>
                <img src="./img/img3.jpg" alt="p3" onError={(e) => {e.target.src='https://placehold.co/300/1a1a1a/c9a035?text=Project+3'}} />
                <h6>PROJECTS</h6>
              </span>
              <span style={{ "--i": 4 }}>
                <img src="./img/img5.jpg" alt="p4" onError={(e) => {e.target.src='https://placehold.co/300/1a1a1a/c9a035?text=Project+4'}} />
                <h6>PROJECTS</h6>
              </span>
              <span style={{ "--i": 5 }}>
                <img src="./img/img4.jpg" alt="p5" onError={(e) => {e.target.src='https://placehold.co/300/1a1a1a/c9a035?text=Project+5'}} />
                <h6>PROJECTS</h6>
              </span>
              <span style={{ "--i": 6 }}>
                <img src="./img/img6.webp" alt="p6" onError={(e) => {e.target.src='https://placehold.co/300/1a1a1a/c9a035?text=Project+6'}} />
                <h6>PROJECTS</h6>
              </span>
              <span style={{ "--i": 7 }}>
                 <img src="./img/img7.jpg" alt="p7" onError={(e) => {e.target.src='https://placehold.co/300/1a1a1a/c9a035?text=Project+7'}} />
                 <h6>PROJECTS</h6>
              </span>
              <span style={{ "--i": 8 }}>
                 <img src="./img/img8.jpg" alt="p8" onError={(e) => {e.target.src='https://placehold.co/300/1a1a1a/c9a035?text=Project+8'}} />
                 <h6>PROJECTS</h6>
              </span>
            </div>
          </div>
        </div>
        {/* second_content */}

        <div className="third_content">
          <div className="third_img">
            <img src="./img/dev.png" alt="myImg" className="my_img3" onError={(e) => {e.target.style.display='none'}} />
            <ion-icon name="ribbon" style={{ fontSize: '100px', color: 'black', display: 'none' }}></ion-icon>
          </div>

          <div className="third_text">
            <div>
              <span>Why</span>
              <span className="name"> Hire me?</span>
            </div>
            <div className="p">
              With extensive knowledge in C++ and front-end development, I have
              created several projects, including a flight booking system
              prototype and a full-featured music streaming website.
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

        <div className="fourth_content"></div>
        {/* fourth_content */}

        <div className="fifth_content">
          <div>Have an Awesome Project</div>
          <div>
            Idea? <span className="name">Let's Discuss</span>
          </div>
        </div>

        <footer>
          <div className="footer_text">
            <div>Lets Connect there</div>
          </div>
          <div className="footer_content">
            <div className="send_box">
              <form className="send_form" id="requestForm" onSubmit={(e) => e.preventDefault()}>
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
                <p id="wordCount" style={{textAlign: "right", color: "#ccc"}}>Words: 0/50</p>
                <button
                  id="submitButton"
                  type="submit"
                  style={{ display: "none" }}
                >
                  Submit
                </button>
              </form>
              <h6 className="h6" style={{color: '#db0000', textAlign: 'center'}}>
                Please note: You can only send one message until a response is
                received.
                <p style={{color: 'white'}}>Thank You!</p>
              </h6>
            </div>

            <button className="send_btn" id="send_btn">
              <div>S</div>
              <div>E</div>
              <div>N</div>
              <div>D</div>
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Home;
