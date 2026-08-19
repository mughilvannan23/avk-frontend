import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaSignInAlt, FaExclamationTriangle } from 'react-icons/fa';
import { authService } from '../../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both Admin ID and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Invalid admin credentials. Default ID: admin | Password: admin123');
    } finally {
      setLoading(false);
    }
  };

  const handlePrefillDefault = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-4">
          <div className="card border-0 shadow-lg p-4 rounded-4" style={{ backgroundColor: '#ffffff' }}>
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 text-danger mb-3"
                style={{ width: '60px', height: '60px' }}
              >
                <FaLock size={26} />
              </div>
              <h2 className="heading-serif text-dark mb-1">Admin Portal</h2>
              <p className="text-muted small">AVK Pathira Maaligai Product Management</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                <FaExclamationTriangle className="flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label font-monospace text-uppercase small text-secondary">
                  Admin ID / Username
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaUser className="text-muted" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control"
                    placeholder="admin"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label font-monospace text-uppercase small text-secondary">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaLock className="text-muted" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-luxury w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 mb-3"
              >
                <FaSignInAlt /> {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>
            </form>

            <div className="text-center border-top pt-3">
              <button
                type="button"
                onClick={handlePrefillDefault}
                className="btn btn-link text-decoration-none btn-sm text-secondary"
              >
                ⚡ Use default admin credentials (admin / admin123)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
