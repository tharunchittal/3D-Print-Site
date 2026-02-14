import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Download() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files');
      setFiles(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load files');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, originalName) => {
    setDownloading(fileId);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/download/${fileId}`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      link.parentChild && link.parentChild.removeChild(link);
    } catch (err) {
      alert('Failed to download file');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">3D Print Site</h1>
            <a
              href="/"
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Upload Files
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Available Files</h2>

        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && files.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No files available yet</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Upload the first file
            </a>
          </div>
        )}

        {!loading && files.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center mb-4">
                  <svg
                    className="w-8 h-8 text-indigo-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-800 break-words flex-1">
                    {file.originalName}
                  </h3>
                </div>

                <div className="space-y-3 mb-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Size:</span>
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Downloads:</span>
                    <span>{file.downloadCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Uploaded:</span>
                    <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div className="text-2xl font-bold text-indigo-600">
                    ${file.price.toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleDownload(file.id, file.originalName)}
                    disabled={downloading === file.id}
                    className={`px-4 py-2 rounded-lg font-bold text-white transition ${
                      downloading === file.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {downloading === file.id ? 'Downloading...' : 'Download'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Download;
