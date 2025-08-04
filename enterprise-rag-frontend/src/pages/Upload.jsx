import { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("");

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
    setStatus("");
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file || !title || !author) {
      setStatus("❌ Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("tags", tags); // optional

    try {
      setStatus("Uploading...");
      await axios.post("http://localhost:8000/ingest", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, 
        },
      });
      setStatus(`✅ Success: File uploaded and processed.`);
      setFile(null);
      setTitle("");
      setAuthor("");
      setTags("");
    } catch (error) {
      setStatus("❌ Upload failed. Check server logs.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Document</h1>

      <div className="w-full max-w-xl space-y-4 bg-white p-6 rounded-xl shadow-lg">
        {/* Title */}
        <div>
          <label className="block font-medium">Title *</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block font-medium">Author *</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mt-1"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium">Tags (comma-separated)</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mt-1"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Drag & Drop Upload */}
        <div
          className="border-2 border-dashed border-slate-300 p-6 rounded-lg text-center cursor-pointer hover:border-indigo-500 transition-all"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-slate-600">Drag and drop a file here, or click to select</p>
          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            Choose File
          </label>
          {file && <p className="mt-2 text-sm text-slate-700">Selected: {file.name}</p>}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full mt-4 px-6 py-3 bg-slate-800 text-white rounded-lg text-lg font-semibold hover:bg-slate-700 transition-all"
        >
          Upload
        </button>

        {status && <p className="mt-4 text-slate-600 font-medium text-center">{status}</p>}
      </div>
    </div>
  );
};

export default Upload;
