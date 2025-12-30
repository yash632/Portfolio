import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="section active">
      <div className="contact_container_new">
        <div className="contact_header_content">
          <h1 data-last-word="Me" className="about_heading">Contact Me</h1>
          <div className="contact_avatar_glass">
            <img src="img/MyImage3.webp" alt="Profile Logic" />
          </div>
        </div>

        <div className="contact_content_wrapper">
          <p className="contact_subtext">
            Feel free to reach out for collaborations, opportunities, or just a friendly hello!
          </p>

          <div className="contact_grid">

            {/* GitHub Card - Full Width */}
            <a href="https://github.com/yash632" target="_blank" rel="noreferrer" className="contact_card glass_card full_width_card">
              <div className="icon_box">
                <ion-icon name="logo-github"></ion-icon>
              </div>
              <h3>GitHub</h3>
              <p>Check out my Repositories</p>
            </a>

            {/* Phone Card */}
            <a href="tel:+919109819310" className="contact_card glass_card">
              <div className="icon_box">
                <ion-icon name="call"></ion-icon>
              </div>
              <h3>Phone</h3>
              <p>+91 9109819310</p>
            </a>

            {/* Email Card */}
            <a href="mailto:yashveers138@gmail.com" className="contact_card glass_card">
              <div className="icon_box">
                <ion-icon name="mail"></ion-icon>
              </div>
              <h3>Email</h3>
              <p>yashveers138@gmail.com</p>
            </a>

            {/* Location Card */}
            <a href="https://goo.gl/maps/7MVPYpGfSH7dWHTV8" target="_blank" rel="noreferrer" className="contact_card glass_card">
              <div className="icon_box">
                <ion-icon name="location-sharp"></ion-icon>
              </div>
              <h3>Location</h3>
              <p>Bhopal, Madhya Pradesh, India</p>
            </a>

            {/* LinkedIn Card */}
            <a href="https://www.linkedin.com/in/yash-rathore-3396b42a1" target="_blank" rel="noreferrer" className="contact_card glass_card">
              <div className="icon_box">
                <ion-icon name="logo-linkedin"></ion-icon>
              </div>
              <h3>LinkedIn</h3>
              <p>Connect with me</p>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
