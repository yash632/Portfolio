import React, { useState } from "react";
import "../stylesheets/admin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Admin = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/admin/login", {
        email: user,
        password: pass,
      });
      toast.success(response.data.message);
      if (response.status === 200) {
        navigate("/admin/dashboard");
        
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="body">
      <div className="admin_box">
        <span className="border"></span>

        <form onSubmit={handleSubmit} autoComplete="off">
          <h2>Sign-in as Admin</h2>

          <div className={`inputBox ${user ? "filled" : ""}`}>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <span>Admin-Id</span>
            <i></i>
          </div>

          <div className={`inputBox ${pass ? "filled" : ""}`}>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <span>Password</span>
            <i></i>
          </div>

          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
};

export default Admin;
