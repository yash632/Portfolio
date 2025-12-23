import React from 'react';

const Resume = () => {
  return (
    <section id="resume" className="section active">
      <div className="resume_container">
        <div className="rcontainer">
           <div className="r1l_cont">
               
              <span className="span1">
                  <span className="brown_bar">
                      <ul className="detail_list">
                         <li className="detail_list_item">
                             <div>
                                 {/* Using placeholder or ionicons as user HTML used svgs rcall.svg */}
                                 <ion-icon name="call" class="img_detail" style={{fontSize: '25px'}}></ion-icon>
                             </div>
                             <div>
                                <a href="tel:+91 9109819310" className="a_detail">+91 9109819310</a>
                             </div>
                         </li>
                          <li className="detail_list_item">
                             <div>
                                 <ion-icon name="mail" class="img_detail" style={{fontSize: '25px'}}></ion-icon>
                             </div>
                             <div>
                                <a href="mailto:yashveers138@gmail.com" className="a_detail">yashveers138@gmail.com</a>
                             </div>
                          </li>
                          <li className="detail_list_item">
                             <div>
                                 <ion-icon name="location" class="img_detail" style={{fontSize: '25px'}}></ion-icon>
                             </div>
                             <div>
                                <a href="https://www.google.com/maps?q=23.3003729,77.4023968" target="_blank" rel="noreferrer" className="a_detail">152 Panchwati Colony Karond, Bhopal</a>
                             </div>
                         </li>
                          <li className="detail_list_item">
                               <div>
                                   <ion-icon name="globe" class="img_detail" style={{fontSize: '25px'}}></ion-icon>
                               </div>
                               <div>
                                  <a href="https://beatblaast.vercel.app" className="a_detail">https://beatblaast.vercel.app</a>
                               </div>
                           </li>
                      </ul>
                      
                  </span>
                  <span className="photo_cont">
                      <ion-icon name="person" style={{fontSize: '100px', color: '#fff'}}></ion-icon>
                  </span>       
              </span>
               
               <span className="span2">
                  <div className="span2_name_container">
                    <span className="span2_name">YASH RATHORE</span> 
                  </div>
                   <div className="about_sec">
                       <div className="block">
                           <h3>ABOUT ME</h3>
                           <p>
                              I am a dedicated web developer with a strong foundation in web development and Python with data science. As a fresher, I possess problem-solving skills, attention to detail, and a collaborative mindset. Eager to apply my knowledge to real-world projects, I am committed to continuous learning and growth in software development.
                           </p>
                           <h3>TECHNICAL SKILLS</h3>
                            <ul>                                 
                                <li><strong>Web Development:</strong> HTML, CSS, JavaScript, Node.js, Express.js.</li>
                                <li><strong>Database:</strong> MongoDB for data management.</li>
                                <li><strong>Python (Data Science):</strong> NumPy, Pandas, Matplotlib.</li>
                                <li><strong>C++:</strong> Object-oriented programming, file handling.</li>
                            </ul>
                           <h3>PROJECTS</h3>
                            <ul>                                 
                                <li><strong>BeatBlaast:</strong> Music streaming website hostd at <a href="https://beatblaast.vercel.app" target="_blank" rel="noreferrer">beatblaast.vercel.app</a>.</li>
                                <li>Fetches songs from GitHub and stores user data in MongoDB.</li>
                                <li><strong>Tech Stack:</strong> Node.js, Express.js, HTML, CSS, JavaScript, MongoDB.</li>
                                <li><strong>Personal Portfolio website:</strong> hosted at <a href="yashportfolio.vercel.app">yashportfolio.vercel.app</a> Built to showcase projects and skills.</li>
                                <li><strong>Tech Stack:</strong> Node.js, Express.js, HTML, CSS, JavaScript, MongoDB.</li>
                                <li><strong>Flight Booking System (OOPM Case Study in College):</strong> Developed in C++ with file handling functionality.</li>
                            </ul>                     
                    </div>    
                   </div>
               </span>
           </div>
           
           <div className="r2_cont">
               <div className="upper_block">
                  <div className="block2">
                      <h3>EDUCATION</h3>
                      <p><strong>SECONDARY SCHOOL:</strong> Bethel Higher Secondary School<br/>2019-2022</p>
                      <p><strong>BACHELOR OF TECHNOLOGY:</strong> Jai Narain College of Technology, Bhopal<br/>Persuing</p>
                      
                      <h3>SKILLS</h3>
                      <ul>
                          <li>Web Development</li>
                          <li>Design Thinking</li>
                          <li>Front End Coding</li>
                          <li>Python with Data Science</li>
                      </ul>
                      
                      <h3>MY HOBBY</h3>
                      <ul>
                         <li>Listening Music</li>
                         <li>Learn More and More New Things</li>
                      </ul>
                  </div>     
               </div>         
            </div>       
            
            <div className="rdload_container">
                <div className="div_for_css">
                   <div className="rdcont">
                       <div>Download My Resume</div>
                       <a href="Yash_Resume.pdf" download="Yash_Resume.pdf">
                           <ion-icon name="download-outline" style={{fontSize: '30px', verticalAlign: 'middle', marginLeft: '10px', color: 'white'}}></ion-icon>
                       </a>
                   </div>
                </div>
            </div>
            
           </div>
      </div>
    </section>
  );
};

export default Resume;
