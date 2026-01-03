import React, { useState, useEffect } from 'react';
import axios from "axios";
import { toast } from 'sonner';

const AdminMessages = () => {
    // Mock Data as provided by user
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 10;

    const observer = React.useRef();
    const lastMessageRef = React.useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const [expandedIds, setExpandedIds] = useState({});

    useEffect(() => {
        fetchMessages();
    }, [page]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/admin/messages?page=${page}&limit=${limit}`, {
                withCredentials: true
            });
            // Map backend 'id' to '_id' to match existing JSX usage without changing layout/code structure
            const newMessages = response.data.data.map(msg => ({
                ...msg,
                _id: msg.id
            }));

            setMessages(prev => {
                // Filter out duplicates just in case, though page logic should handle it
                const existingIds = new Set(prev.map(m => m._id));
                const uniqueNew = newMessages.filter(m => !existingIds.has(m._id));
                return [...prev, ...uniqueNew];
            });

            // Simple check for "has more": if we got full limit, likely there's more (or exactly limit).
            // Better logic would be if backend sent total count, but current python code doesn't.
            // We can check if returned length < limit, then definitely no more.
            // But if length == limit, we assume more might exist.
            setHasMore(newMessages.length === limit); // Corrected to check length of data array
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch messages.");
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleStatus = async (e, id, currentStatus) => {
        e.stopPropagation();
        const newStatus = currentStatus === 'pending' ? 'responded' : 'pending';

        try {
            await axios.post('/admin/respond', { _id: id, status: newStatus }, { withCredentials: true });

            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg._id === id ? { ...msg, status: newStatus } : msg
                )
            );
            toast.success(`Message marked as ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const toggleBlock = async (e, id, currentStatus) => {
        e.stopPropagation();
        const isBlocked = currentStatus === 'blocked';
        const newStatus = isBlocked ? 'pending' : 'blocked'; // Default to pending when unblocking

        try {
            await axios.post('/admin/block', { _id: id, status: newStatus }, { withCredentials: true });

            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg._id === id ? { ...msg, status: newStatus } : msg
                )
            );
            toast.success(isBlocked ? "Message Unblocked" : "Message Blocked");
        } catch (error) {
            toast.error("Failed to block/unblock message");
        }
    };

    const deleteMessage = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) return;

        try {
            await axios.post('/admin/delete_message', { _id: id }, { withCredentials: true });

            setMessages(prev => prev.filter(msg => msg._id !== id));
            toast.success("Message deleted successfully");
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    const formatDate = (dateInput) => {
        if (!dateInput) return 'N/A';

        let dateString = dateInput;
        // Handle MongoDB Extended JSON format: { $date: "..." }
        if (typeof dateInput === 'object' && dateInput.$date) {
            dateString = dateInput.$date;
        }

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) + ' ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="admin-messages-container">
            <h2 className="section-title">Message Center</h2>

            <div className="messages-grid">
                {messages.map((msg, index) => {
                    const isLastMessage = messages.length === index + 1;
                    const isExpanded = expandedIds[msg._id];

                    return (
                        <div
                            ref={isLastMessage ? lastMessageRef : null}
                            key={msg._id}
                            className={`premium-card ${msg.status} ${isExpanded ? 'active-card' : ''}`}
                            onClick={() => toggleExpand(msg._id)}
                        >
                            {/* Card Glow Effect */}
                            <div className="card-glow"></div>

                            {/* Header: User Info & Status */}
                            <div className="card-header">
                                <div className="user-info">
                                    <div className="avatar-placeholder">
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="meta">
                                        <span className="user-name">{msg.name}</span>
                                        <span className="msg-time">{formatDate(msg.created_at)}</span>
                                    </div>
                                </div>
                                <div className={`status-badge ${msg.status}`}>
                                    {msg.status === 'blocked' && <i className="fi fi-sr-lock"></i>}
                                    {msg.status === 'responded' && <i className="fi fi-sr-check-circle"></i>}
                                    {msg.status === 'pending' && <i className="fi fi-sr-clock"></i>}
                                    <span>{msg.status}</span>
                                </div>
                            </div>

                            {/* Body: Message Content */}
                            <div className="card-body">
                                <p className={`message-text ${isExpanded ? 'full' : 'truncated'}`}>
                                    {msg.message}
                                </p>
                                <div className="expand-hint">
                                    {isExpanded ? 'Click to collapse' : 'Click to read more'}
                                </div>
                            </div>

                            {/* Footer: User Details & Actions */}
                            <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                                <div className="contact-mini">
                                    <i className="fi fi-sr-envelope"></i>
                                    <span>{msg.email}</span>
                                </div>

                                <div className="action-bar">
                                    {/* STATUS TOGGLE */}
                                    {msg.status !== 'blocked' && (
                                        <button
                                            className="action-btn status-btn"
                                            onClick={(e) => toggleStatus(e, msg._id, msg.status)}
                                            title={msg.status === 'responded' ? "Mark Pending" : "Mark Responded"}
                                        >
                                            <i className={`fi ${msg.status === 'responded' ? 'fi-sr-undo' : 'fi-sr-check'}`}></i>
                                        </button>
                                    )}

                                    {/* BLOCK BUTTON */}
                                    <button
                                        className={`action-btn block-btn ${msg.status === 'blocked' ? 'active' : ''}`}
                                        onClick={(e) => toggleBlock(e, msg._id, msg.status)}
                                        title={msg.status === 'blocked' ? "Unblock" : "Block"}
                                    >
                                        <i className="fi fi-sr-ban"></i>
                                    </button>

                                    {/* DELETE BUTTON */}
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={(e) => deleteMessage(e, msg._id)}
                                        title="Delete Permanently"
                                    >
                                        <i className="fi fi-sr-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {loading && <div className="loading-bar">Fetching Messages...</div>}
            {!hasMore && messages.length > 0 && <div className="end-of-list">You're all caught up!</div>}
        </div>
    );
};

export default AdminMessages;
