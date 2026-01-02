import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const AdminUploads = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [fileType, setFileType] = useState("photo");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [load, setLoad] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const formData = new FormData();
      formData.append("file", file); // 👈 MUST
      formData.append("title", title);
      formData.append("description", description);
      formData.append(
        "skills",
        JSON.stringify(skills.split(",").map((s) => s.trim()))
      );
      formData.append("type", fileType);

      const response = await axios.post("/admin/upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);
      setLoad(false);
      // reset
      setFile(null);
      setPreview(null);
      setTitle("");
      setDescription("");
      setSkills("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
      setLoad(false);
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
                <button
                  className="remove-preview-btn"
                  onClick={handleRemoveFile}
                >
                  <i className="fi fi-sr-trash"></i>
                </button>
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

        <button type="submit" className="upload-btn" disabled={load}>
          {load ? "Uploading..." : "Upload Project"}
        </button>
      </form>
    </div>
  );
};

export default AdminUploads;
