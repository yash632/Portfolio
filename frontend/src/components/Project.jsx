import React, { useState } from 'react';

const projectsData = [
  {
    id: 1,
    title: "AstraEye: Vision for Blind",
    description: "AI assistant for visually impaired users. Navigates obstacles using depth estimation (MiDaS) & contours.",
    tech: ["Python", "OpenCV", "Generative AI"],
    type: "video",
    src: "videos/astraeye.mp4",
    poster: "https://placehold.co/600x400/1a1a1a/00ffff?text=AstraEye"
  },
  {
    id: 2,
    title: "HennaBliss",
    description: "Platform connecting seekers with mehndi artists. Features real-time hiring and messaging w/ Socket.IO.",
    tech: ["MERN Stack", "Redux", "Socket.IO"],
    type: "video",
    src: "videos/hennabliss.mp4",
    poster: "https://placehold.co/600x400/1a1a1a/ff00ff?text=HennaBliss"
  },
  {
    id: 3,
    title: "Vision Safe",
    description: "Real-time surveillance system detecting faces to identify criminals or missing persons.",
    tech: ["Flask", "YOLO", "FaceNet"],
    type: "video",
    src: "videos/visionsafe.mp4",
    poster: "https://placehold.co/600x400/1a1a1a/00ffcc?text=VisionSafe"
  },
  {
    id: 4,
    title: "BeatBlaast",
    description: "Seamless music streaming platform syncing playlists with MongoDB and fetching tracks dynamically.",
    tech: ["Node.js", "Express", "MongoDB"],
    type: "image",
    src: "https://placehold.co/600x400/1a1a1a/1e90ff?text=BeatBlaast_UI",
    poster: ""
  },
  {
    id: 5,
    title: "Project Astitva",
    description: "Virtual human clone with lip-sync animation. Uses SadTalker, Gemini, and Coqui TTS.",
    tech: ["Deep Learning", "Generative AI", "Python"],
    type: "video",
    src: "videos/astitva.mp4",
    poster: "https://placehold.co/600x400/1a1a1a/da70d6?text=Project_Astitva"
  },
  {
    id: 6,
    title: "Weather Dashboard",
    description: "Live weather tracking functionality using OpenWeather API and Python.",
    tech: ["Python", "API Integration"],
    type: "image",
    src: "https://placehold.co/600x400/1a1a1a/ffffff?text=Weather_App",
    poster: ""
  }
];

const Project = () => {
  const [filter, setFilter] = useState('all');

  const filteredProjects = projectsData.filter(project => {
    if (filter === 'all') return true;
    return project.type === filter;
  });

  return (
    <section id="project" className="section active">
      <div className="project_container_new">
        <h1 data-last-word="Work" className="about_heading">My Projects</h1>

        <div className="project_content_wrapper">

          {/* Filter Tabs */}
          <div className="filter_container">
            <button
              className={`filter_btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter_btn ${filter === 'image' ? 'active' : ''}`}
              onClick={() => setFilter('image')}
            >
              Images
            </button>
            <button
              className={`filter_btn ${filter === 'video' ? 'active' : ''}`}
              onClick={() => setFilter('video')}
            >
              Videos
            </button>
          </div>

          <div className="project_grid">
            {filteredProjects.map((project) => (
              <div className="project_card glass_card" key={project.id}>

                {project.type === 'video' ? (
                  <div className="media_wrapper video_wrapper">
                    <video controls poster={project.poster}>
                      <source src={project.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="media_wrapper image_wrapper">
                    <img src={project.src} alt={project.title} />
                  </div>
                )}

                <div className="project_info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tech_tags">
                    {project.tech.map((tech, index) => (
                      <span key={index}>{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Project;
