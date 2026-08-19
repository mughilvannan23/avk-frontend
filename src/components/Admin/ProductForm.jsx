import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import ImageUploader from './ImageUploader';
import { mockApi } from '../../services/mockApi';

export default function ProductForm({ initialData = null, onSubmit, onCancel, submitting = false }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    material: 'Brass',
    size: '',
    weight: '',
    price: '',
    oldPrice: '',
    discount: '',
    rating: 5,
    reviewsCount: 0,
    images: [],
    description: '',
    specifications: [],
    disclaimer: ''
  });

  const [categories, setCategories] = useState([]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const list = await mockApi.getCategories();
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list);
          if (!initialData && list.length > 0) {
            setFormData(prev => ({ ...prev, category: prev.category || list[0] }));
          }
        }
      } catch (err) {
        console.error("Failed to load categories in ProductForm:", err);
      }
    };
    fetchCats();
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        subcategory: initialData.subcategory || '',
        material: initialData.material || '',
        size: initialData.size || '',
        weight: initialData.weight || '',
        price: initialData.price !== undefined ? initialData.price : '',
        oldPrice: initialData.oldPrice !== undefined && initialData.oldPrice !== null ? initialData.oldPrice : '',
        discount: initialData.discount || '',
        rating: initialData.rating || 5,
        reviewsCount: initialData.reviewsCount || 0,
        images: initialData.images || [],
        description: initialData.description || '',
        specifications: initialData.specifications || [],
        disclaimer: initialData.disclaimer || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category' && value === '__new__') {
      setIsCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle specification field changes
  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: updatedSpecs }));
  };

  const handleAddSpec = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }]
    }));
  };

  const handleRemoveSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Format data before submitting
    const payload = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      rating: Number(formData.rating) || 5,
      reviewsCount: Number(formData.reviewsCount) || 0,
      specifications: formData.specifications.filter(s => s.label.trim() && s.value.trim())
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h4 className="heading-serif mb-0 text-dark">
          {initialData ? '✏️ Edit Product' : '✨ Add New Product'}
        </h4>
        <button type="button" onClick={onCancel} className="btn btn-outline-secondary btn-sm rounded-circle p-2">
          <FaTimes />
        </button>
      </div>

      <div className="row g-3">
        {/* Name */}
        <div className="col-12">
          <label className="form-label fw-bold">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="e.g. Elephant Idol in Antique Brass Finish"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* Category & Subcategory */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label fw-bold mb-0">Category *</label>
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none small text-warning fw-semibold"
              style={{ fontSize: '0.8rem' }}
              onClick={() => setIsCustomCategory(!isCustomCategory)}
            >
              {isCustomCategory ? '← Select Existing' : '+ Add New Category'}
            </button>
          </div>

          {isCustomCategory ? (
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-control ${errors.category ? 'is-invalid' : ''}`}
              placeholder="Enter new category name (e.g. Copperware)"
            />
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-select ${errors.category ? 'is-invalid' : ''}`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__new__">+ Add New Category...</option>
            </select>
          )}
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Subcategory</label>
          <input
            type="text"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. Table Decor, Ganesha, Diyas"
          />
        </div>

        {/* Material, Size, Weight */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Material</label>
          <input
            type="text"
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. Brass, Copper, Bronze"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Size</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. 14 x 7 x 11.5 inches"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Weight</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. 11.670 Kg"
          />
        </div>

        {/* Pricing */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Price (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
            placeholder="e.g. 33599"
          />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Old Price (₹)</label>
          <input
            type="number"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. 67199"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Discount Tag</label>
          <input
            type="text"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. 50% OFF"
          />
        </div>

        {/* Rating & Reviews */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Rating (1 to 5)</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="5"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Reviews Count</label>
          <input
            type="number"
            min="0"
            name="reviewsCount"
            value={formData.reviewsCount}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Cloudinary Image Uploader */}
        <div className="col-12">
          <ImageUploader
            images={formData.images}
            onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
          />
        </div>

        {/* Description */}
        <div className="col-12">
          <label className="form-label fw-bold">Description *</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            placeholder="Provide a detailed description of the handcrafted item..."
          ></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        {/* Specifications Builder */}
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label fw-bold mb-0">Specifications</label>
            <button
              type="button"
              onClick={handleAddSpec}
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
            >
              <FaPlus size={12} /> Add Specification
            </button>
          </div>

          {formData.specifications.length === 0 ? (
            <p className="text-muted small italic">No custom specifications added yet.</p>
          ) : (
            formData.specifications.map((spec, index) => (
              <div key={index} className="row g-2 mb-2 align-items-center">
                <div className="col-5">
                  <input
                    type="text"
                    placeholder="Label (e.g. Size)"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-5">
                  <input
                    type="text"
                    placeholder="Value (e.g. 14 inches)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="btn btn-outline-danger btn-sm w-100 p-1"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Disclaimer */}
        <div className="col-12">
          <label className="form-label fw-bold">Handcraft Disclaimer</label>
          <input
            type="text"
            name="disclaimer"
            value={formData.disclaimer}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. Every piece is individually handcrafted..."
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
        <button type="button" onClick={onCancel} className="btn btn-light px-4">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="btn btn-luxury px-4 d-flex align-items-center gap-2">
          <FaSave /> {submitting ? 'Saving...' : (initialData ? 'Update Product' : 'Save Product')}
        </button>
      </div>
    </form>
  );
}
