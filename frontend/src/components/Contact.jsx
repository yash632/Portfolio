import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="section active">
      <div className="acontact_body">
        <div className="acontact">
          <div className="con_section">            
              <h1>Contact Me</h1>
              <ul>
                  <li>
                      <div>
                          <a href="tel:+91 9109819310">Mobile No.</a>
                      </div>
                  </li>
                  <li>
                      <div>
                          <a href="mailto: yashveers138@gmail.com">Gmail</a>
                      </div>
                  </li>
                  <li>
                      <div>
                          <a href="https://www.linkedin.com/in/yash-rathore-3396b42a1?utm_source=share&utm_campaign=share_via&utm_content=profile" target="_blank" rel="noreferrer">LinkedIn</a>
                      </div>
                  </li>
              </ul>
          </div>
          <div className="con_photo">
              <img src="https://i.ibb.co/Jn7gL1k/contact.jpg" alt="contact" className="con_img" onError={(e) => {e.target.style.display='none'}} />
               {/* Fallback */}
              <ion-icon name="chatbubbles" style={{fontSize: '80px', color: 'var(--brown)', display: 'none'}}></ion-icon>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
