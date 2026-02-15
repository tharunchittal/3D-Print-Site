import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ token, onLogout }) {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingPrice, setEditingPrice] = useState('');
  const [tab, setTab] = useState('all');
  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [filesRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/files', { headers }),
        axios.get('http://localhost:5000/api/admin/stats', { headers }),
      ]);

      setFiles(filesRes.data);
      setStats(statsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      if (err.response?.status === 401) {
        onLogout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrice = async (fileId, price) => {
    if (!price || isNaN(price)) return;

    try {
      await axios.put(
        `http://localhost:5000/api/admin/files/${fileId}/price`,
        { price: parseFloat(price) },
        { headers }
      );

      setFiles(
        files.map((f) =>
          f.id === fileId ? { ...f, price: parseFloat(price), status: 'approved' } : f
        )
      );
      setEditingId(null);
      setEditingPrice('');
    } catch (err) {
      alert('Failed to set price');
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/files/${fileId}`, {
          headers,
        });

        setFiles(files.filter((f) => f.id !== fileId));
      } catch (err) {
        alert('Failed to delete file');
      }
    }
  };

  const handleUpdatePayment = async (fileId, paymentStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/files/${fileId}/payment`,
        { paymentStatus },
        { headers }
      );

      setFiles(
        files.map((f) => (f.id === fileId ? { ...f, paymentStatus } : f))
      );
    } catch (err) {
      alert('Failed to update payment status');
    }
  };

  const handleDownload = async (fileId, originalName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/download/${fileId}`,
        {
          responseType: 'blob',
          headers,
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
    }
  };

  const filteredFiles =
    tab === 'pending'
      ? files.filter((f) => f.status === 'pending')
      : tab === 'approved'
      ? files.filter((f) => f.status === 'approved')
      : files;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={() => {
              onLogout();
              navigate('/login');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-600 rounded-lg p-6 text-white">
              <p className="text-blue-200">Total Files</p>
              <p className="text-3xl font-bold">{stats.totalFiles}</p>
            </div>
            <div className="bg-yellow-600 rounded-lg p-6 text-white">
              <p className="text-yellow-200">Pending</p>
              <p className="text-3xl font-bold">{stats.pendingFiles}</p>
            </div>
            <div className="bg-green-600 rounded-lg p-6 text-white">
              <p className="text-green-200">Approved</p>
              <p className="text-3xl font-bold">{stats.approvedFiles}</p>
            </div>
            <div className="bg-purple-600 rounded-lg p-6 text-white">
              <p className="text-purple-200">Total Downloads</p>
              <p className="text-3xl font-bold">{stats.totalDownloads}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          {['all', 'pending', 'approved'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 font-medium transition capitalize ${
                tab === t
                  ? 'text-indigo-500 border-b-2 border-indigo-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Files Table */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No files found</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-700 text-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">File Name</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Purpose</th>
                  <th className="px-4 py-3 text-left">Size</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Downloads</th>
                  <th className="px-4 py-3 text-left">Uploaded</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-700 transition">
                    <td className="px-4 py-3 text-gray-300 max-w-xs truncate">
                      {file.originalName}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{file.customerName || '-'}</td>
                    <td className="px-4 py-3 text-gray-400">{file.purpose || '-'}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          file.status === 'approved'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}
                      >
                        {file.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={file.paymentStatus || 'unpaid'}
                          onChange={(e) =>
                            handleUpdatePayment(file.id, e.target.value)
                          }
                          className="px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 text-sm"
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="cash">Paid (Cash)</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingId === file.id ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(e.target.value)}
                            className="w-24 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600"
                            placeholder="$"
                          />
                          <button
                            onClick={() =>
                              handleSetPrice(file.id, editingPrice)
                            }
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {file.price !== null ? (
                            <>
                              <span className="text-green-400 font-bold">
                                ${file.price.toFixed(2)}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingId(file.id);
                                  setEditingPrice(file.price);
                                }}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                              >
                                Edit
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingId(file.id);
                                setEditingPrice('');
                              }}
                              className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
                            >
                              Set Price
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {file.downloadCount || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() =>
                            handleDownload(file.id, file.originalName)
                          }
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
