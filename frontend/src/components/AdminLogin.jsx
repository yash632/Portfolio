import React from 'react';
import '../stylesheets/adminLogin.css';

const AdminLogin = () => {
    return (
        <div className="admin-login-body">
            <div className="box">
                <span className="border"></span>
                <form action="/dashboard" method="POST">
                    <h2>Sign-in as Admin</h2>
                    <div className="inputBox">
                        <input type="text" name="username" required />
                        <span>Admin-Id</span>
                        <i></i>
                    </div>
                    <div className="inputBox">
                        <input type="password" name="password" required />
                        <span>Password</span>
                        <i></i>
                    </div>
                    <input type="submit" value="Login" />
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
