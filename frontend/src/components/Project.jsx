import React, { useState, useEffect } from 'react';
import axios from "axios";
import { toast } from 'sonner';

// const MOCK_PROJECTS = [];

const Project = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Ref to track if it's the initial mount to prevent double fetching if strict mode
  // const isInitialMount = React.useRef(true);

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
        // Parse skills: handle legacy JSON strings "['A','B']" vs comma-separated "A,B"
        tech: (() => {
          let s = item.skills;
          // If it's already an array, just clean the elements
          if (Array.isArray(s)) {
            return s.map(str => typeof str === 'string' ? str.replace(/[\[\]"']/g, '').trim() : str);
          }
          if (!s) return [];
          // Check if it looks like a JSON array string
          if (typeof s === 'string' && s.trim().startsWith('[') && s.trim().endsWith(']')) {
            try {
              const parsed = JSON.parse(s);
              if (Array.isArray(parsed)) return parsed;
            } catch (e) { }
          }
          // Fallback: split by comma and clean up
          return s.split(',').map(str => str.replace(/[\[\]"']/g, '').trim()).filter(Boolean);
        })(),
        type: item.file_type === 'photo' ? 'image' : 'video', // Map backend type to frontend
        src: item.url,
        poster: item.poster_url || "" // 🆕 POSTER SUPPORT
      }));

      setProjects(prev => {
        // Merge logic: If page 1, reset to Mock + Fetched. Else append.
        if (pageNum === 1) {
          // Filter mock data locally
          // const filteredMock = MOCK_PROJECTS.filter(p => currentFilter === 'all' || p.type === currentFilter);
          return [...fetchedData];
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
                    <video controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} controls poster={project.poster}>
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
                  <pre>{project.description}</pre>
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
