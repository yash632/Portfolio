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
        <div className="admin-messages">
            <h2>User Messages</h2>
            <div className="messages-list">
                {messages.map((msg, index) => {
                    const isLastMessage = messages.length === index + 1;
                    return (
                        <div
                            ref={isLastMessage ? lastMessageRef : null}
                            key={msg._id}
                            className={`message-card ${expandedIds[msg._id] ? 'expanded' : ''} ${msg.status}`}
                            onClick={() => toggleExpand(msg._id)}
                        >
                            <div className="message-header">
                                <div className="header-left">
                                    {/* Status Toggle (Pending/Responded) - Hide if blocked? Or disable? */}
                                    {msg.status !== 'blocked' && (
                                        <div className="status-wrapper">
                                            <button
                                                className={`status-toggle ${msg.status === 'responded' ? 'checked' : ''}`}
                                                onClick={(e) => toggleStatus(e, msg._id, msg.status)}
                                                title={msg.status === 'responded' ? "Mark as Pending" : "Mark as Responded"}
                                            >
                                                {msg.status === 'responded' ? (
                                                    <i className="fi fi-sr-check"></i>
                                                ) : (
                                                    <div className="pending-dot"></div>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {/* Block/Unblock Toggle */}
                                    <div className="status-wrapper" style={{ marginLeft: msg.status === 'blocked' ? 0 : '10px' }}>
                                        <button
                                            className={`status-toggle ${msg.status === 'blocked' ? 'blocked-active' : 'block-btn'}`}
                                            onClick={(e) => toggleBlock(e, msg._id, msg.status)}
                                            title={msg.status === 'blocked' ? "Unblock User" : "Block User"}
                                            style={{ borderColor: msg.status === 'blocked' ? '#ef4444' : 'rgba(255,255,255,0.2)' }}
                                        >
                                            <i className={`fi ${msg.status === 'blocked' ? 'fi-sr-lock' : 'fi-sr-ban'}`} style={{ fontSize: '0.8rem', color: msg.status === 'blocked' ? '#ef4444' : '#94a3b8' }}></i>
                                        </button>
                                    </div>

                                    <span className="msg-name" style={{ opacity: msg.status === 'blocked' ? 0.5 : 1 }}>{msg.name}</span>
                                    {msg.status === 'blocked' && <span className="blocked-tag">BLOCKED</span>}
                                </div>
                                <span className="msg-date">{formatDate(msg.created_at)}</span>
                            </div>

                            <div className="message-preview">
                                {expandedIds[msg._id] ? "" : <p className="preview-text">{msg.message.substring(0, 50)}{msg.message.length > 50 ? '...' : ''}</p>}
                            </div>

                            {expandedIds[msg._id] && (
                                <div className="message-details">
                                    <div className="detail-row full-message">
                                        <strong>Message:</strong>
                                        <p>{msg.message}</p>
                                    </div>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <strong>Email</strong> <span>{msg.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>IP</strong> <span>{msg.ip || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>ID</strong> <span>{msg._id}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Status</strong> <span style={{ textTransform: 'uppercase', color: msg.status === 'blocked' ? '#ef4444' : 'inherit' }}>{msg.status}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {loading && <div className="loading-spinner" style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>Loading...</div>}
                {!hasMore && messages.length > 0 && <div className="end-message" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No more messages</div>}
            </div>
        </div>
    );
};

export default AdminMessages;
