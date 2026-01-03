import React, { useState, useEffect } from 'react';
import axios from "axios";
import { toast } from 'sonner';

const AdminMedia = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState({});
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            // Using existing fetch route, limiting to recent 50 for now or handling pagination later if needed
            const response = await axios.get("/fetch/media?limit=100");
            setMedia(response.data.data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch media");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this specific media item?")) return;

        try {
            await axios.post("/admin/delete_media", { _id: id }, { withCredentials: true });
            toast.success("Media deleted successfully");
            // Remove from local state
            setMedia(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete media");
        }
    };

    const toggleEdit = (item) => {
        if (editMode[item.id]) {
            // Cancel edit
            setEditMode(prev => ({ ...prev, [item.id]: false }));
        } else {
            // Start edit
            setEditData(prev => ({ ...prev, [item.id]: { ...item } }));
            setEditMode(prev => ({ ...prev, [item.id]: true }));
        }
    };

    const handleEditChange = (id, field, value) => {
        setEditData(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const handleSave = async (id) => {
        const data = editData[id];
        try {
            await axios.post("/admin/edit_media", {
                _id: id,
                title: data.title,
                description: data.description,
                skills: data.skills
            }, { withCredentials: true });

            toast.success("Media updated successfully");

            // Update local state
            setMedia(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

            // Exit edit mode
            setEditMode(prev => ({ ...prev, [id]: false }));
        } catch (error) {
            toast.error("Failed to update media");
        }
    };

    return (
        <div className="admin-media customFont">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', color: '#fff' }}>Media Management</h2>
            <div className="project_grid">
                {media.length === 0 && !loading && <p style={{ color: '#94a3b8' }}>No media found.</p>}

                {media.map((item) => (
                    <div key={item.id} className="project_card glass_card">

                        {item.file_type === 'video' ? (
                            <div className="media_wrapper video_wrapper">
                                <video src={item.url} muted />
                            </div>
                        ) : (
                            <div className="media_wrapper image_wrapper">
                                <img src={item.url} alt={item.title} />
                            </div>
                        )}

                        <div className="project_info" style={{ position: 'relative' }}>
                            {editMode[item.id] ? (
                                // Edit Mode UI
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
                                    <input
                                        maxLength={40}
                                        type="text"
                                        value={editData[item.id]?.title || ''}
                                        onChange={(e) => handleEditChange(item.id, 'title', e.target.value)}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', color: '#fff', borderRadius: '5px', width: '100%' }}
                                    />
                                    <textarea
                                        value={editData[item.id]?.description || ''}
                                        onChange={(e) => handleEditChange(item.id, 'description', e.target.value)}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', color: '#fff', borderRadius: '5px', width: '100%', minHeight: '80px', resize: 'vertical' }}
                                    />
                                    <input
                                        type="text"
                                        value={editData[item.id]?.skills || ''}
                                        onChange={(e) => handleEditChange(item.id, 'skills', e.target.value)}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', color: '#fff', borderRadius: '5px', width: '100%' }}
                                    />
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button onClick={() => handleSave(item.id)} style={{ padding: '8px 15px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save</button>
                                        <button onClick={() => toggleEdit(item)} style={{ padding: '8px 15px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode UI
                                <>
                                    <h3>{item.title}</h3>
                                    <p>{item.description ? item.description.substring(0, 80) + (item.description.length > 80 ? '...' : '') : 'No description'}</p>

                                    <div className="tech_tags">
                                        {/* Parse skills string or array */}
                                        {Array.isArray(item.skills)
                                            ? item.skills.map((skill, i) => <span key={i}>{skill}</span>)
                                            : (item.skills ? item.skills.split(',').map((skill, i) => <span key={i}>{skill.trim()}</span>) : null)
                                        }
                                    </div>

                                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => toggleEdit(item)}
                                            className="delete-btn-hover"
                                            style={{
                                                background: 'rgba(56, 189, 248, 0.1)',
                                                color: '#38bdf8',
                                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                                borderRadius: '8px',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                transition: '0.3s'
                                            }}
                                            title="Edit Project"
                                        >
                                            <i className="fi fi-sr-pencil"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="delete-btn-hover"
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.2)',
                                                color: '#ef4444',
                                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                                borderRadius: '8px',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                transition: '0.3s'
                                            }}
                                            title="Delete Project"
                                        >
                                            <i className="fi fi-sr-trash"></i>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {loading && <p style={{ color: '#fff', marginTop: '20px', textAlign: 'center' }}>Loading media...</p>}
        </div>
    );
};

export default AdminMedia;
