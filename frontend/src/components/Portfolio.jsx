import React from 'react';
import '../stylesheets/style.css';

const projects = [
    {
        id: 1,
        title: "AstraEye: Vision for Blind",
        description: "AI assistant for visually impaired users. Navigates obstacles using depth estimation (MiDaS) & contours. Features conversational AI (Gemini 2.5) for environment understanding and specific object detection (YOLO).",
        tech: ["Python", "OpenCV", "MiDaS", "Gemini 2.5", "YOLO"],
        image: "https://placehold.co/600x400/1a1a1a/00ffff?text=AstraEye"
    },
    {
        id: 2,
        title: "HennaBliss",
        description: "A platform connecting seekers with mehndi artists. Features portfolio uploads, real-time hiring, and built-in messaging using Socket.IO. Built with MERN stack and Redux Toolkit.",
        tech: ["React", "Node.js", "Express", "MongoDB", "Socket.IO", "Redux"],
        image: "https://placehold.co/600x400/1a1a1a/ff00ff?text=HennaBliss"
    },
    {
        id: 3,
        title: "Vision Safe",
        description: "Real-time surveillance system detecting faces to identify criminals or missing persons using FaceNet and YOLO. Sends instant alerts upon match detection.",
        tech: ["React", "Flask", "YOLO", "FaceNet", "Socket.IO", "MongoDB"],
        image: "https://placehold.co/600x400/1a1a1a/00ffcc?text=VisionSafe"
    },
    {
        id: 4,
        title: "BeatBlaast",
        description: "A seamless music streaming platform that fetches tracks dynamically from GitHub and syncs playlists with MongoDB.",
        tech: ["Node.js", "Express", "MongoDB", "GitHub API", "JavaScript"],
        image: "https://placehold.co/600x400/1a1a1a/1e90ff?text=BeatBlaast"
    },
    {
        id: 5,
        title: "Project Astitva",
        description: "A virtual human clone capable of realistic interaction. Uses modified SadTalker pipeline for lip-sync facial animation generation, Gemini for responses, Coqui TTS for voice, and SR/STT models.",
        tech: ["Python", "SadTalker", "Gemini", "Coqui TTS", "Deep Learning"],
        image: "https://placehold.co/600x400/1a1a1a/da70d6?text=Project_Astitva"
    },
    {
        id: 6,
        title: "Weather Dashboard",
        description: "Live weather tracking application providing forecasts and historical data visualization. Built using Tkinter and OpenWeather API.",
        tech: ["Python", "Tkinter", "OpenWeather API"],
        image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Weather"
    }
];

const Portfolio = () => {
    return (
        <div className="portfolio-container">
            <div className="portfolio-grid">
                {projects.map((project) => (
                    <div className="project-card" key={project.id}>
                        <div className="card-image">
                            <img src={project.image} alt={project.title} />
                            <div className="card-overlay">
                                {/* <span>View Project</span> */}
                            </div>
                        </div>
                        <div className="card-content">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="tech-stack">
                                {project.tech.map((tech, index) => (
                                    <span key={index} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Portfolio;
