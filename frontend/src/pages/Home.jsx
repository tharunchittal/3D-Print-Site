import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [purpose, setPurpose] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('customerName', customerName);
    formData.append('purpose', purpose);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/files/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('File uploaded successfully! Please wait for admin approval.');
      setFile(null);
      setCustomerName('');
      setPurpose('');
      setTimeout(() => {
        navigate('/download');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">3D Print Site</h1>
            <a
              href="/download"
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Download Files
            </a>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Upload Your File
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-500 transition">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                disabled={uploading}
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg
                  className="w-12 h-12 text-indigo-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-indigo-600 font-medium">Click to upload</p>
                <p className="text-gray-500 text-sm">or drag and drop</p>
              </label>

              {file && (
                <div className="mt-4 p-3 bg-indigo-50 rounded">
                  <p className="text-gray-700 font-medium break-words">
                    Selected: {file.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={uploading}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Purpose of Print</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  disabled={uploading}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. prototype, replacement part, gift"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${
                uploading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">What happens next?</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>✓ Your file is uploaded to our server</li>
              <li>✓ Admin reviews and approves it</li>
              <li>✓ Price is set by the admin</li>
                <li>✓ Other users can download it</li>
            </ul>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 text-sm">
                  Note: All payments must be made in cash, in person to Tharun Chittal.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
