import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

import { isMobile } from "../utils/device";

const MAX_VIDEO_MB = 10; // 🔒 HARD LIMIT

const AdminUploads = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [fileType, setFileType] = useState("photo");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [load, setLoad] = useState(false);
  const [fileSize, setFileSize] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadEta, setUploadEta] = useState(null);

  // 🛡️ PREVENT ACCIDENTAL RELOADS / CLOSING
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (load) {
        e.preventDefault(); // Standard
        e.returnValue = ""; // Chrome requires this to be set
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [load]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setFileSize((selectedFile.size / (1024 * 1024)).toFixed(2)); // Size in MB
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    setFile(null);
    setPreview(null);
    setFileSize(null);
  };

  const doUpload = async (uploadFile) => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "skills",
      JSON.stringify(skills.split(",").map((s) => s.trim()))
    );
    formData.append("type", fileType);

    const startTime = Date.now();

    const response = await axios.post("/admin/upload", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);

        // ETA Calculation (Dynamic based on real-time network speed)
        // We calculate speed based on total bytes loaded vs total time elapsed.
        // This automatically adjusts if network speed fluctuates.
        const timeElapsed = (Date.now() - startTime) / 1000; // seconds
        const uploadSpeed = progressEvent.loaded / timeElapsed; // bytes/sec
        const remainingBytes = progressEvent.total - progressEvent.loaded;
        const secondsRemaining = remainingBytes / uploadSpeed;

        if (secondsRemaining < 60) {
          setUploadEta(`${Math.round(secondsRemaining)}s`);
        } else {
          setUploadEta(`${Math.round(secondsRemaining / 60)}m`);
        }
      },
    });

    toast.success(response.data.message);

    setFile(null);
    setPreview(null);
    setFileSize(null);
    setTitle("");
    setDescription("");
    setSkills("");
    setUploadProgress(0);
    setUploadEta(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoad(true);
    setUploadProgress(0);

    try {
      let uploadFile = file;

      // 🔥 VIDEO LOGIC (SAFE & CONTROLLED)
      if (fileType === "video") {
        const sizeMB = file.size / (1024 * 1024);

        // ⚠️ WARN: Mobile devices
        if (isMobile()) {
          toast.custom(
            (t) => (
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "16px",
                  borderRadius: "12px",
                  color: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  minWidth: "300px",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "start" }}>
                  <div
                    style={{
                      background: "rgba(6, 182, 212, 0.1)", // Cyan tint
                      color: "var(--neon-cyan)",
                      padding: "8px",
                      borderRadius: "8px",
                    }}
                  >
                    <i className="fi fi-sr-smartphone" style={{ fontSize: "1.2rem" }}></i>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem" }}>Mobile Upload Detected</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                      Video uploads from mobile may be unstable.
                      <br />
                      Keep the screen active.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      toast.dismiss(t);
                      setLoad(false);
                    }}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      toast.dismiss(t);
                      try {
                        await doUpload(file);
                      } catch {
                        toast.error("Upload failed");
                      } finally {
                        setLoad(false);
                      }
                    }}
                    style={{
                      background: "linear-gradient(90deg, #38bdf8, #a855f7)",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      color: "#fff",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    Upload Anyway
                  </button>
                </div>
              </div>
            ),
            { duration: Infinity, position: "top-center" }
          );
          return;
        }

        // ❌ DENY: Large video
        if (sizeMB > MAX_VIDEO_MB) {
          toast.custom(
            (t) => (
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "16px",
                  borderRadius: "12px",
                  color: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  minWidth: "300px",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "start" }}>
                  <div
                    style={{
                      background: "rgba(251, 191, 36, 0.1)",
                      color: "#fbbf24",
                      padding: "8px",
                      borderRadius: "8px",
                    }}
                  >
                    <i className="fi fi-sr-exclamation" style={{ fontSize: "1.2rem" }}></i>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem" }}>Large Video Detected</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                      File size: <b style={{ color: "#fff" }}>{sizeMB.toFixed(1)} MB</b>.
                      <br />
                      Compression will be skipped.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      toast.dismiss(t);
                      setLoad(false);
                    }}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      toast.dismiss(t);
                      try {
                        await doUpload(file); // 🔥 NORMAL UPLOAD
                      } catch {
                        toast.error("Upload failed");
                      } finally {
                        setLoad(false);
                      }
                    }}
                    style={{
                      background: "linear-gradient(90deg, #38bdf8, #a855f7)",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      color: "#fff",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    Upload Anyway
                  </button>
                </div>
              </div>
            ),
            { duration: Infinity, position: "top-center" }
          );

          return; // 👈 VERY IMPORTANT
        }

        // ✅ ALLOW: Desktop + small video (Upload Directly without compression)
      }

      await doUpload(uploadFile);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoad(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="admin-uploads">
      <h2>Media Uploads</h2>
      <form className="upload-form" onSubmit={handleUpload}>
        <div className="form-group">
          <label>Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Portfolio Website"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="admin-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project details and overview..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Skills / Technologies</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, Node.js, CSS (comma separated)"
          />
        </div>

        <div className="form-group">
          <label>Media Type</label>
          <div className="type-selector">
            <button
              type="button"
              className={fileType === "photo" ? "active" : ""}
              onClick={() => {
                setFileType("photo");
                setPreview(null);
                setFile(null);
                setFileSize(null);
              }}
            >
              Photo
            </button>
            <button
              type="button"
              className={fileType === "video" ? "active" : ""}
              onClick={() => {
                setFileType("video");
                setPreview(null);
                setFile(null);
                setFileSize(null);
              }}
            >
              Video
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Select File</label>
          <div className={`file-drop-zone ${preview ? "has-preview" : ""}`}>
            {!preview && (
              <input
                type="file"
                accept={fileType === "photo" ? "image/*" : "video/*"}
                onChange={handleFileChange}
              />
            )}

            {preview ? (
              <div className="preview-container">
                {fileType === "photo" ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="file-preview-image"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="file-preview-video"
                  />
                )}

                {/* 
                  ✅ META & ACTIONS 
                  Wrapper positioned absolutely to top-right.
                */}
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '8px', alignItems: 'center', zIndex: 30 }}>
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(4px)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    {fileSize} MB
                  </div>

                  <button
                    className="remove-preview-btn"
                    onClick={handleRemoveFile}
                    style={{ position: 'static', margin: 0 }}
                  >
                    <i className="fi fi-sr-trash"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div className="drop-content">
                <i
                  className={`fi ${fileType === "photo" ? "fi-sr-picture" : "fi-sr-play-alt"
                    }`}
                ></i>
                <span>
                  Click to browse {fileType === "photo" ? "Images" : "Videos"}
                </span>
              </div>
            )}
          </div>
        </div>

        {load && (
          <div className="upload-progress-container" style={{ marginBottom: '20px' }}>
            <div className="progress-info" style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '8px' }}>
              <span>Uploading... {uploadProgress}%</span>
              <span>{uploadEta ? `~${uploadEta} remaining` : 'Calculating...'}</span>
            </div>
            <div className="progress-bar-track" style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
              <div className="progress-bar-fill" style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #a855f7)', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
        )}

        <button type="submit" className="upload-btn" disabled={load}>
          {load ? "Processing..." : "Upload Project"}
        </button>
      </form>
    </div>
  );
};

export default AdminUploads;
