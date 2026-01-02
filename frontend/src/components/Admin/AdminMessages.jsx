import React, { useState } from 'react';

const AdminMessages = () => {
    // Mock Data as provided by user
    const [messages, setMessages] = useState([
        {
            _id: "6957a113cf311ab494cb8832",
            name: "Yash Rathore",
            email: "yashveers138@gmail.com",
            message: "ds",
            status: "pending",
            ip: "127.0.0.1",
            created_at: "2026-01-02T10:42:27.619+00:00"
        },
        // Adding a few more mock messages for testing
        {
            _id: "6957a113cf311ab494cb8833",
            name: "John Doe",
            email: "john@example.com",
            message: "I would like to discuss a project with you regarding web development.",
            status: "read",
            ip: "192.168.1.1",
            created_at: "2026-01-01T09:15:00.000+00:00"
        },
        {
            _id: "6957a113cf311ab494cb8834",
            name: "Jane Smith",
            email: "jane@test.com",
            message: "Great portfolio! Are you available for freelance work?",
            status: "pending",
            ip: "10.0.0.5",
            created_at: "2025-12-30T14:20:10.000+00:00"
        }
    ]);

    const [expandedIds, setExpandedIds] = useState({});

    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleStatus = (e, id) => {
        e.stopPropagation(); // Prevent row expansion when clicking toggle
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg._id === id
                    ? { ...msg, status: msg.status === 'pending' ? 'read' : 'pending' }
                    : msg
            )
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="admin-messages">
            <h2>User Messages</h2>
            <div className="messages-list">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`message-card ${expandedIds[msg._id] ? 'expanded' : ''} ${msg.status}`}
                        onClick={() => toggleExpand(msg._id)}
                    >
                        <div className="message-header">
                            <div className="header-left">
                                <div className="status-wrapper">
                                    <button
                                        className={`status-toggle ${msg.status === 'read' ? 'checked' : ''}`}
                                        onClick={(e) => toggleStatus(e, msg._id)}
                                        title={msg.status === 'read' ? "Mark as Pending" : "Mark as Read"}
                                    >
                                        {msg.status === 'read' ? (
                                            <i className="fi fi-sr-check"></i>
                                        ) : (
                                            <div className="pending-dot"></div>
                                        )}
                                    </button>
                                </div>
                                <span className="msg-name">{msg.name}</span>
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
                                        <strong>IP</strong> <span>{msg.ip}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>ID</strong> <span>{msg._id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Status</strong> <span>{msg.status}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMessages;
