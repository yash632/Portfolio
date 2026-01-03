import React, { useState, useEffect } from 'react';
import axios from "axios";
import { toast } from 'sonner';

const MOCK_PROJECTS = [
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
    id: 5,
    title: "Project Astitva",
    description: "Virtual human clone with lip-sync animation. Uses SadTalker, Gemini, and Coqui TTS.",
    tech: ["Deep Learning", "Generative AI", "Python"],
    type: "video",
    src: "videos/astitva.mp4",
    poster: "https://placehold.co/600x400/1a1a1a/da70d6?text=Project_Astitva"
  }
];

const Project = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Ref to track if it's the initial mount to prevent double fetching if strict mode
  const isInitialMount = React.useRef(true);

  // Fetch Logic
  const fetchProjects = async (pageNum, currentFilter) => {
    setLoading(true);
    try {
      const mediaType = currentFilter === 'image' ? 'photo' : currentFilter; // map 'image' -> 'photo'
      const response = await axios.get(`/fetch/media?page=${pageNum}&limit=10&type=${mediaType}`);

      const fetchedData = response.data.data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        tech: Array.isArray(item.skills) ? item.skills : (item.skills ? item.skills.split(',') : []), // Handle skills format
        type: item.file_type === 'photo' ? 'image' : 'video', // Map backend type to frontend
        src: item.url,
        poster: "" // Backend might not have poster, default empty
      }));

      setProjects(prev => {
        // Merge logic: If page 1, reset to Mock + Fetched. Else append.
        if (pageNum === 1) {
          // Filter mock data locally
          const filteredMock = MOCK_PROJECTS.filter(p => currentFilter === 'all' || p.type === currentFilter);
          return [...filteredMock, ...fetchedData];
        } else {
          return [...prev, ...fetchedData];
        }
      });

      setHasMore(fetchedData.length === 10); // Standard limit check
      setLoading(false);

    } catch (error) {
      console.error("Failed to fetch projects", error);
      toast.error("Failed to load more projects");
      setLoading(false);
    }
  };

  // Effect to fetch when filter changes
  useEffect(() => {
    setPage(1); // Reset page
    setHasMore(true);
    fetchProjects(1, filter);
  }, [filter]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProjects(nextPage, filter);
  };

  // Lightbox Logic
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (src) => {
    setSelectedImage(src);
    document.body.style.overflow = 'hidden'; // Disable scroll
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Enable scroll
  };

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
            {projects.map((project) => (
              <div className="project_card glass_card" key={project.id}>

                {project.type === 'video' ? (
                  <div className="media_wrapper video_wrapper">
                    <video controls poster={project.poster}>
                      <source src={project.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="media_wrapper image_wrapper" onClick={() => openLightbox(project.src)} style={{ cursor: 'pointer' }}>
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

          {/* Load More Button */}
          {hasMore && (
            <div className="load-more-container" style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={loadMore}
                className="filter_btn" // Reuse filter btn style for consistency
                disabled={loading}
                style={{ padding: '12px 30px', fontSize: '1rem' }}
              >
                {loading ? "Loading..." : "Load More Projects"}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
            <img src={selectedImage} alt="Enlarged Project" className="lightbox-image" />
          </div>
        </div>
      )}
    </section>
  );
};

export default Project;
