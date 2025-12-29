import React from 'react';

const About = () => {
  return (
    <section id="about" className="section active">
      <div className="about_container">
        <h1 data-last-word="Me" className="about_heading">About</h1>

        <div className="about_content_wrapper">
          <div className="about_card glass_card">
            <p className="bio_text">
              I’m <strong>Yash Rathore</strong>, a B.Tech student in Artificial Intelligence & Machine Learning and a hands-on MERN Stack developer.
              I enjoy building intelligent, real-world systems where machine learning meets full-stack engineering.
              My work spans computer vision, data science, and scalable web applications, with a strong focus on clean logic and practical impact.
            </p>
            <p className="bio_text">
              I’ve built projects like real-time surveillance systems using <strong>YOLO</strong> and <strong>FaceNet</strong>,
              AI-powered navigation for the visually impaired, and full-fledged web platforms for music streaming and local service discovery.
              I don’t just train models—I design complete systems, from backend logic to frontend experience.
              I’m always driven to learn, experiment, and turn complex ideas into reliable, usable products.
            </p>
          </div>

          <div className="skills_grid">
            <div className="skill_card glass_card">
              <h3>Web Development</h3>
              <p>MERN Stack (MongoDB, Express, React, Node.js), HTML, CSS, JavaScript, Flask, Socket.IO</p>
            </div>

            <div className="skill_card glass_card">
              <h3>AI & ML</h3>
              <p>YOLO, FaceNet, OpenCV, scikit-learn, Computer Vision, Deep Learning</p>
            </div>

            <div className="skill_card glass_card">
              <h3>Data Science</h3>
              <p>Python, NumPy, Pandas, Matplotlib, Data Visualization</p>
            </div>

            <div className="skill_card glass_card">
              <h3>Languages</h3>
              <p>Python, C++, JavaScript</p>
            </div>

            <div className="skill_card glass_card">
              <h3>Tools & Platforms</h3>
              <p>Git, GitHub, Cloudinary, VS Code</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
