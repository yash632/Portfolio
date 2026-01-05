import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, NavLink, Outlet } from 'react-router-dom';
import '../../stylesheets/admin.css';
import axios from "axios"
import { toast } from "sonner"

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(null); // null = checking

    useEffect(() => {
        axios
            .get("/admin/check-auth", { withCredentials: true })
            .then((res) => {
                setIsAdmin(res.data.admin);
            })
            .catch(() => {
                setIsAdmin(false);
            });
    }, []);

    if (isAdmin === null) {
        return <div>Checking access...</div>;
    }

    if (!isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    const handleLogout = async () => {
        try {
            const response = await axios.post("/admin/logout");
            toast.success(response.data.message);
            if (response.status === 200) {
                navigate('/admin');
            }
        }
        catch (error) {
            toast.error(error.response.data.message || "Something Went Wrong!");
        }
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-nav">
                <div className="nav-header">
                    <h3>Admin Panel</h3>
                </div>
                <ul className="nav-links">
                    <li>
                        <NavLink
                            to="messages"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            Messages
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="uploads"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            Uploads
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="media"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            Media
                        </NavLink>
                    </li>
                </ul>
                <div className="nav-footer">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <main className="admin-content">
                <button className="mobile-logout-btn" onClick={handleLogout} title="Logout">
                    <i className="fi fi-sr-sign-out-alt"></i>
                </button>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;
