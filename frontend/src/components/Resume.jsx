import React from 'react';

const Resume = () => {
    return (
        <section id="resume" className="section active">
            <div className="resume_container_new">
                <h1 data-last-word="Resume" className="about_heading">My Resume</h1>

                <div className="resume_content_grid">

                    <div className="resume_content_grid" style={{ display: 'block' }}>

                        {/* Internships Row */}
                        <div className="resume_row_vertical">
                            <div className="vertical_header">
                                <h2 className="vertical_text">INTERNSHIPS</h2>
                            </div>
                            <div className="resume_content_right">
                                <div className="resume_card glass_card">
                                    <div className="resume_item">
                                        <div className="year">06/2024 - 08/2024</div>
                                        <h3 className="role">Python with Data Science & Image Processing</h3>
                                        <p className="institution">Internship</p>
                                    </div>
                                    <div className="resume_item">
                                        <div className="year">09/2023 - 11/2023</div>
                                        <h3 className="role">AI–ML Virtual Internship</h3>
                                        <p className="institution">Google</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Training Row */}
                        <div className="resume_row_vertical">
                            <div className="vertical_header">
                                <h2 className="vertical_text">TRAINING</h2>
                            </div>
                            <div className="resume_content_right">
                                <div className="resume_card glass_card">
                                    <div className="resume_item">
                                        <div className="year">07/2025 - 08/2025</div>
                                        <h3 className="role">Digital Skills Readiness Program – Data Science</h3>
                                        <p className="institution">Wipro TalentNext</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Certifications Row */}
                        <div className="resume_row_vertical">
                            <div className="vertical_header">
                                <h2 className="vertical_text">CERTIFICATIONS</h2>
                            </div>
                            <div className="resume_content_right">
                                <div className="resume_card glass_card">
                                    <div className="resume_item">
                                        <h3 className="role">NPTEL: Python for Data Science</h3>
                                        <p className="institution">Elite + Silver (75%)</p>
                                    </div>
                                    <div className="resume_item">
                                        <div className="year">12/2023 - 02/2024</div>
                                        <h3 className="role">Cisco: Programming Essentials in Python</h3>
                                        <p className="institution">Cisco</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="download_btn_container">
                    <a href="Yash_Resume.pdf" download="Yash_Resume.pdf" className="download_btn">
                        <span>Download Resume</span>
                        <ion-icon name="download-outline"></ion-icon>
                    </a>
                </div>

            </div>
        </section>
    );
};

export default Resume;
