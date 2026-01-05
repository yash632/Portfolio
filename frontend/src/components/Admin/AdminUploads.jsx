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
  const [posterFile, setPosterFile] = useState(null); // 🆕 Poster State
  const [posterPreview, setPosterPreview] = useState(null); // 🆕 Poster Preview
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

  const handlePosterChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPosterFile(selectedFile);
      setPosterPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemovePoster = (e) => {
    e.preventDefault();
    setPosterFile(null);
    setPosterPreview(null);
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    setFile(null);
    setPreview(null);
    setFileSize(null);
    // Also clear poster on full clear? Maybe optional.
  };

  // ☁️ HELPER: Upload to Cloudinary Directly
  const uploadToCloudinary = async (file, resourceType, onProgress) => {
    // 1. Get Signature from Backend
    const sigRes = await axios.post("/admin/generate-signature",
      { folder: "" }, // Optional folder
      { withCredentials: true }
    );
    const { signature, api_key, cloud_name, timestamp } = sigRes.data;

    // 2. Prepare Form Data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    // 3. Upload to Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`;

    const response = await axios.post(url, formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress) onProgress(progressEvent);
      }
    });

    return response.data; // contains secure_url, public_id
  };

  const doUpload = async (uploadFile) => {
    // 🛑 VALIDATION: Check required metadata first
    if (!title.trim() || !description.trim() || !skills.trim()) {
      toast.error("Please fill in Title, Description, and Skills!");
      return;
    }

    setLoad(true); // 🟢 FORCE UI VISIBILITY
    const startTime = Date.now();

    // ----------------------------------------------------------------
    // 🎥 VIDEO: DIRECT UPLOAD STRATEGY
    // ----------------------------------------------------------------
    if (fileType === "video") {
      try {
        // A. Upload Main Video
        // Reset Time for accurate speed calc (ignoring signature fetch time)
        const uploadStart = Date.now();

        const videoData = await uploadToCloudinary(uploadFile, "video", (progressEvent) => {
          const loaded = progressEvent.loaded;
          const total = progressEvent.total || uploadFile.size;

          const percent = Math.round((loaded * 100) / total);
          setUploadProgress(percent);

          // Debugging
          // console.log(`Video Progress: ${percent}%, Loaded: ${loaded}, Total: ${total}`);

          const timeElapsed = (Date.now() - uploadStart) / 1000;

          if (timeElapsed > 0.5 && loaded > 0) {
            const speed = loaded / timeElapsed;
            const remaining = total - loaded;
            const seconds = remaining / speed;

            if (isFinite(seconds)) {
              const etaStr = seconds < 60
                ? `${Math.round(seconds)}s`
                : `${Math.round(seconds / 60)}m`;

              setUploadEta(etaStr);
            }
          }
        });

        // B. Upload Poster (If exists)
        let posterUrl = "";
        let posterId = "";

        if (posterFile) {
          const posterData = await uploadToCloudinary(posterFile, "image", null);
          posterUrl = posterData.secure_url;
          posterId = posterData.public_id;
        }

        // C. Save Metadata to Backend
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("skills", skills);
        formData.append("type", "video");
        formData.append("url", videoData.secure_url);
        formData.append("id", videoData.public_id);
        formData.append("poster_url", posterUrl);
        formData.append("poster_id", posterId);

        const serverRes = await axios.post("/admin/upload", formData, {
          withCredentials: true
        });

        toast.success(serverRes.data.message);
        resetForm();

      } catch (err) {
        console.error(err);
        toast.error("Direct Upload Failed");
        setLoad(false);
        setUploadProgress(0);
      }
      return;
    }

    // ----------------------------------------------------------------
    // 🖼️ PHOTO: SERVER-SIDE UPLOAD (Remaining Logic)
    // ----------------------------------------------------------------
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("skills", skills);
    formData.append("type", fileType);

    try {
      const response = await axios.post("/admin/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          setUploadProgress(Math.round((loaded * 100) / total));

          // Simple ETA for photos
          const timeElapsed = (Date.now() - startTime) / 1000;
          const uploadSpeed = loaded / timeElapsed;
          const remaining = (total - loaded) / uploadSpeed;
          if (isFinite(remaining) && remaining >= 0) {
            setUploadEta(remaining < 60 ? `${Math.round(remaining)}s` : `${Math.round(remaining / 60)}m`);
          }
        },
      });
      toast.success(response.data.message);
      resetForm();
    } catch (err) {
      toast.error("Upload Failed");
      setLoad(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setFileSize(null);
    setPosterFile(null);
    setPosterPreview(null);
    setTitle("");
    setDescription("");
    setSkills("");
    setUploadProgress(0);
    setUploadEta(null);
    setLoad(false);
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
                setPosterFile(null);
                setPosterPreview(null);
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
                setPosterFile(null);
                setPosterPreview(null);
              }}
            >
              Video
            </button>
          </div>
        </div>



        {/* 🆕 POSTER UPLOAD (Only for Video) */}
        {
          fileType === "video" && (
            <div className="form-group">
              <label>Video Poster (Thumbnail)</label>
              <div className={`file-drop-zone ${posterPreview ? "has-preview" : ""}`} style={{ minHeight: '120px' }}>
                {!posterPreview && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterChange}
                  />
                )}

                {posterPreview ? (
                  <div className="preview-container">
                    <img
                      src={posterPreview}
                      alt="Poster Preview"
                      className="file-preview-image"
                      style={{ objectFit: "cover" }}
                    />
                    {/* <div className="file-meta-overlay">
                      <span>Poster</span>
                    </div> */}
                    <button
                      className="remove-preview-btn"
                      onClick={handleRemovePoster}
                    >
                      <i className="fi fi-sr-trash"></i>
                    </button>
                  </div>
                ) : (
                  <div className="drop-content">
                    <i className="fi fi-sr-picture"></i>
                    <span>Select Cover Image</span>
                  </div>
                )}
              </div>
            </div>
          )
        }

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

        {
          load && (
            <div className="upload-progress-container" style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="progress-info" style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '10px', fontWeight: '500' }}>
                <span style={{ color: '#fff' }}>Uploading... {uploadProgress}%</span>
                <span>{uploadEta ? `~${uploadEta} remaining` : 'Calculating...'}</span>
              </div>

              <div className="progress-bar-track" style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <div className="progress-bar-fill" style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #a855f7)', transition: 'width 0.2s ease', borderRadius: '10px' }}></div>
              </div>
            </div>
          )
        }

        <button type="submit" className="upload-btn" disabled={load} style={{ opacity: load ? 0.7 : 1, cursor: load ? 'not-allowed' : 'pointer' }}>
          {load ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <i className="fi fi-sr-spinner-alt fi-spin"></i>
              <span>Processing...</span>
            </div>
          ) : "Upload Project"}
        </button>
      </form >
    </div >
  );
};

export default AdminUploads;
