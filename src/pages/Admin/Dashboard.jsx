import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaSearch,
  FaBoxOpen,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaImage
} from 'react-icons/fa';
import { productService, authService } from '../../services/api';
import ProductForm from '../../components/Admin/ProductForm';
import { formatCurrency } from '../../utils/formatCurrency';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Check auth
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to connect to MongoDB server. Ensure backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (formData) => {
    setSubmitting(true);
    try {
      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        await productService.updateProduct(id, formData);
        setMessage(`✨ Product "${formData.name}" updated successfully!`);
      } else {
        await productService.createProduct(formData);
        setMessage(`✨ New product "${formData.name}" added successfully!`);
      }
      setShowForm(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (err) {
      console.error("Save product failed:", err);
      setError(err.response?.data?.message || 'Failed to save product in MongoDB.');
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleDeleteProduct = async (product) => {
    const id = product._id || product.id;
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await productService.deleteProduct(id);
      setMessage(`🗑️ Product "${product.name}" deleted successfully!`);
      await loadProducts();
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleDeleteAllProducts = async () => {
    if (products.length === 0) return;
    if (!window.confirm(`⚠️ WARNING: Are you sure you want to delete ALL ${products.length} products? This cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      for (const p of products) {
        const id = p._id || p.id;
        await productService.deleteProduct(id);
      }
      setMessage(`🗑️ All products have been deleted successfully.`);
      await loadProducts();
    } catch (err) {
      console.error("Bulk delete failed:", err);
      setError('Failed to delete all products.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.material && p.material.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container-fluid px-4 py-4" style={{ minHeight: '80vh', backgroundColor: '#fcfbf8' }}>
      {/* Top Admin Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <span className="badge bg-danger text-uppercase font-monospace mb-1">Admin Panel</span>
          <h2 className="heading-serif mb-0 text-dark">Product Management</h2>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenAddForm}
            className="btn btn-luxury d-flex align-items-center gap-2"
          >
            <FaPlus /> Add Product
          </button>

          {products.length > 0 && (
            <button
              onClick={handleDeleteAllProducts}
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              title="Delete all products"
            >
              <FaTrash /> Clear All Products
            </button>
          )}

          <button
            onClick={handleLogout}
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            title="Logout"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3">
          <FaCheckCircle className="flex-shrink-0" />
          <div>{message}</div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3">
          <FaExclamationTriangle className="flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {/* Add / Edit Form Modal / Block */}
      {showForm ? (
        <div className="mb-5">
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleSaveProduct}
            onCancel={handleCloseForm}
            submitting={submitting}
          />
        </div>
      ) : (
        <>
          {/* Controls Bar: Search */}
          <div className="card border-0 shadow-sm p-3 mb-4">
            <div className="row align-items-center g-3">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, category or material..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-8 text-md-end text-muted small">
                Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> total products in MongoDB
              </div>
            </div>
          </div>

          {/* Product Table */}
          {loading ? (
            <div className="text-center py-5">
              <FaSpinner className="spinner-border text-danger me-2" />
              <span>Fetching products from MongoDB...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5 card border-0 shadow-sm p-4">
              <FaBoxOpen size={48} className="text-muted mb-3" />
              <h5>No products found</h5>
              <p className="text-muted small mb-3">No matching products found in database.</p>
              <div>
                <button onClick={handleOpenAddForm} className="btn btn-luxury btn-sm">
                  Add Your First Product
                </button>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light font-monospace text-uppercase small">
                    <tr>
                      <th style={{ width: '80px' }}>Image</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Material</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th style={{ width: '120px' }} className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => {
                      const id = p._id || p.id;
                      const thumb = (p.images && p.images.length > 0) ? p.images[0] : null;

                      return (
                        <tr key={id}>
                          <td>
                            <div className="ratio ratio-1x1 rounded border bg-light overflow-hidden" style={{ width: '56px', height: '56px' }}>
                              {thumb ? (
                                <img src={thumb} alt={p.name} style={{ objectFit: 'cover' }} />
                              ) : (
                                <div className="d-flex align-items-center justify-content-center text-muted">
                                  <FaImage size={18} />
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold text-dark mb-0">{p.name}</div>
                            <span className="small text-muted font-monospace">{id}</span>
                          </td>
                          <td>
                            <span className="badge bg-secondary bg-opacity-10 text-secondary border">
                              {p.category}
                            </span>
                            {p.subcategory && (
                              <div className="small text-muted">{p.subcategory}</div>
                            )}
                          </td>
                          <td className="small">{p.material || 'N/A'}</td>
                          <td>
                            <div className="fw-bold text-dark">{formatCurrency(p.price)}</div>
                            {p.oldPrice && (
                              <div className="small text-muted text-decoration-line-through">
                                {formatCurrency(p.oldPrice)}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              ★ {p.rating || 5}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-2">
                              <button
                                onClick={() => handleOpenEditForm(p)}
                                className="btn btn-outline-secondary btn-sm p-1 px-2"
                                title="Edit product"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                disabled={deletingId === id}
                                className="btn btn-outline-danger btn-sm p-1 px-2"
                                title="Delete product"
                              >
                                {deletingId === id ? <FaSpinner className="spinner-border spinner-border-sm" /> : <FaTrash />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
