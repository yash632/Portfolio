import React from 'react';

const Project = () => {
  return (
    <section id="project" className="section active">
        {/* User's HTML only showed the text 'Project Section' for this ID.
            However, keeping it clean with a container. */}
        <div className="mcontainer" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'}}>
            <h1 style={{color: 'var(--brown)', fontSize: '3rem'}}>Project Section</h1>
             <p style={{color: 'var(--text-main)', marginTop: '20px'}}>Check out the projects on the Home page.</p>
        </div>
    </section>
  );
};

export default Project;
