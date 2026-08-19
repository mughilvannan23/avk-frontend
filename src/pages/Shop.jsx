import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { FaFilter, FaSlidersH, FaTimes, FaChevronDown, FaCheck } from 'react-icons/fa';
import { mockApi } from '../services/mockApi';
import ProductList from '../components/Product/ProductList';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read URL parameters
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState(categoryParam ? [categoryParam] : []);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');

  // Synchronize category selection if URL category changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryParam]);

  // Fetch filtered products from API
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        // Compile price filters
        let priceMin = undefined;
        let priceMax = undefined;

        if (selectedPriceRanges.length > 0) {
          const limits = selectedPriceRanges.map(range => {
            if (range === 'under-5k') return { min: 0, max: 5000 };
            if (range === '5k-15k') return { min: 5000, max: 15000 };
            if (range === '15k-25k') return { min: 15000, max: 25000 };
            if (range === 'over-25k') return { min: 25000, max: 999999 };
            return { min: 0, max: 999999 };
          });

          priceMin = Math.min(...limits.map(l => l.min));
          priceMax = Math.max(...limits.map(l => l.max));
        }

        const apiFilters = {
          category: selectedCategories.length === 1 ? selectedCategories[0] : 'All',
          material: selectedMaterials,
          priceMin,
          priceMax,
          searchQuery: searchParam,
          sortBy: sortBy
        };

        let result = await mockApi.getProducts(apiFilters);

        if (selectedCategories.length > 1) {
          result = result.filter(p => selectedCategories.includes(p.category));
        }

        setProducts(result);
      } catch (err) {
        console.error("Error fetching filtered products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategories, selectedMaterials, selectedPriceRanges, sortBy, searchParam]);

  // Checkbox state handlers
  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleMaterialChange = (mat) => {
    setSelectedMaterials(prev =>
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const handlePriceChange = (range) => {
    setSelectedPriceRanges(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedPriceRanges([]);
    setSortBy('relevance');
    setSearchParams({});
  };

  const totalActiveFilters = selectedCategories.length + selectedMaterials.length + selectedPriceRanges.length + (searchParam ? 1 : 0);

  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await mockApi.getCategories();
        if (Array.isArray(cats) && cats.length > 0) {
          setCategoriesList(cats);
        }
      } catch (err) {
        console.error("Error fetching categories in Shop:", err);
      }
    };
    fetchCategories();
  }, []);

  const priceRangesList = [
    { label: "Under ₹5,000", value: "under-5k" },
    { label: "₹5,000 - ₹15,000", value: "5k-15k" },
    { label: "₹15,000 - ₹25,000", value: "15k-25k" },
    { label: "Over ₹25,000", value: "over-25k" }
  ];
  const materialsList = ["Brass", "Copper", "Tin", "Quartz"];

  return (
    <div className="container py-3 py-md-4">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb breadcrumb-luxury mb-3">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active" aria-current="page">Shop</li>
        </ol>
      </nav>

      {/* Headline & Sorting Controls Bar (Desktop) */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-3 mb-md-4 gy-2">
        <div>
          <h2 className="heading-serif h3 mb-1 text-dark">
            {searchParam ? `Search Results for "${searchParam}"` : 'Our Catalog'}
          </h2>
          <p className="small text-muted mb-0">Showing {products.length} elegant items</p>
        </div>

        {/* Sort Selector & Clear Filters on Desktop */}
        <div className="d-none d-md-flex align-items-center gap-3 mt-3 mt-md-0">
          <select 
            className="form-select text-dark" 
            style={{ width: '220px', height: '42px', fontSize: '0.85rem', borderColor: 'var(--gray-border)', borderRadius: '8px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Sort By: Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating: Highest First</option>
          </select>

          {totalActiveFilters > 0 && (
            <button 
              onClick={clearAllFilters}
              className="btn btn-luxury-outline py-2 px-3 d-flex align-items-center gap-1"
              style={{ height: '42px', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              <FaTimes /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE HORIZONTAL FILTER SCROLLBAR (Compact Pills matching Amazon/Flipkart) */}
      {/* ========================================================================= */}
      <div className="d-block d-md-none mb-3">
        <div className="mobile-filter-bar">
          {/* Main Filter Icon Button */}
          <button
            type="button"
            className={`filter-chip-btn filter-chip-btn-primary ${totalActiveFilters > 0 ? 'active' : ''}`}
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileFilterOffcanvas"
            aria-controls="mobileFilterOffcanvas"
          >
            <FaSlidersH size={13} />
            <span>Filters</span>
            {totalActiveFilters > 0 && (
              <span className="badge bg-danger rounded-circle ms-1" style={{ fontSize: '0.65rem' }}>
                {totalActiveFilters}
              </span>
            )}
          </button>

          {/* Vertical Divider */}
          <div className="filter-divider" />

          {/* Category Dropdown Pill */}
          <div className="dropdown flex-shrink-0">
            <button
              className={`filter-chip-btn dropdown-toggle ${selectedCategories.length > 0 ? 'active' : ''}`}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedCategories.length === 1
                ? selectedCategories[0]
                : selectedCategories.length > 1
                ? `${selectedCategories.length} Categories`
                : 'Category'}
            </button>
            <ul className="dropdown-menu shadow border-0 p-2" style={{ maxHeight: '280px', overflowY: 'auto', minWidth: '200px' }}>
              {categoriesList.map((cat) => (
                <li key={cat}>
                  <label className="dropdown-item d-flex align-items-center gap-2 small cursor-pointer py-1.5 rounded">
                    <input
                      type="checkbox"
                      className="form-check-input form-check-input-luxury"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    {cat}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Dropdown Pill */}
          <div className="dropdown flex-shrink-0">
            <button
              className={`filter-chip-btn dropdown-toggle ${selectedPriceRanges.length > 0 ? 'active' : ''}`}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedPriceRanges.length > 0 ? 'Price Selected' : 'Price'}
            </button>
            <ul className="dropdown-menu shadow border-0 p-2" style={{ minWidth: '190px' }}>
              {priceRangesList.map((range) => (
                <li key={range.value}>
                  <label className="dropdown-item d-flex align-items-center gap-2 small cursor-pointer py-1.5 rounded">
                    <input
                      type="checkbox"
                      className="form-check-input form-check-input-luxury"
                      checked={selectedPriceRanges.includes(range.value)}
                      onChange={() => handlePriceChange(range.value)}
                    />
                    {range.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Material Dropdown Pill */}
          <div className="dropdown flex-shrink-0">
            <button
              className={`filter-chip-btn dropdown-toggle ${selectedMaterials.length > 0 ? 'active' : ''}`}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedMaterials.length > 0 ? 'Material Selected' : 'Material'}
            </button>
            <ul className="dropdown-menu shadow border-0 p-2" style={{ minWidth: '170px' }}>
              {materialsList.map((mat) => (
                <li key={mat}>
                  <label className="dropdown-item d-flex align-items-center gap-2 small cursor-pointer py-1.5 rounded">
                    <input
                      type="checkbox"
                      className="form-check-input form-check-input-luxury"
                      checked={selectedMaterials.includes(mat)}
                      onChange={() => handleMaterialChange(mat)}
                    />
                    {mat}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort By Dropdown Pill */}
          <div className="dropdown flex-shrink-0">
            <button
              className="filter-chip-btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort
            </button>
            <ul className="dropdown-menu shadow border-0 p-2" style={{ minWidth: '180px' }}>
              <li>
                <button className={`dropdown-item small py-1.5 rounded ${sortBy === 'relevance' ? 'fw-bold text-danger' : ''}`} onClick={() => setSortBy('relevance')}>
                  Relevance
                </button>
              </li>
              <li>
                <button className={`dropdown-item small py-1.5 rounded ${sortBy === 'price-asc' ? 'fw-bold text-danger' : ''}`} onClick={() => setSortBy('price-asc')}>
                  Price: Low to High
                </button>
              </li>
              <li>
                <button className={`dropdown-item small py-1.5 rounded ${sortBy === 'price-desc' ? 'fw-bold text-danger' : ''}`} onClick={() => setSortBy('price-desc')}>
                  Price: High to Low
                </button>
              </li>
              <li>
                <button className={`dropdown-item small py-1.5 rounded ${sortBy === 'rating' ? 'fw-bold text-danger' : ''}`} onClick={() => setSortBy('rating')}>
                  Rating: Highest First
                </button>
              </li>
            </ul>
          </div>

          {/* Clear Filters Button (If active) */}
          {totalActiveFilters > 0 && (
            <button
              onClick={clearAllFilters}
              className="filter-chip-btn text-danger border-danger flex-shrink-0"
            >
              <FaTimes size={10} /> Clear ({totalActiveFilters})
            </button>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="row gy-4">
        {/* Desktop Sidebar Filters Column (Hidden on Mobile) */}
        <div className="col-12 col-md-4 col-lg-3 d-none d-md-block">
          <div className="bg-white p-4 border border-light shadow-sm sticky-md-top" style={{ top: '120px', zIndex: 10, borderRadius: '12px' }}>
            <h4 className="heading-serif h5 border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
              <FaFilter size={14} className="text-secondary" /> Filters
            </h4>

            {/* Filter Accordions */}
            <div className="accordion accordion-luxury border-0" id="filterAccordion">
              {/* Category Filter */}
              <div className="accordion-item border-0 border-bottom">
                <h2 className="accordion-header" id="headingFilterCategories">
                  <button className="accordion-button px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilterCategories" aria-expanded="true" aria-controls="collapseFilterCategories">
                    Categories
                  </button>
                </h2>
                <div id="collapseFilterCategories" className="accordion-collapse collapse show" aria-labelledby="headingFilterCategories">
                  <div className="accordion-body px-0 pt-1 pb-3">
                    {categoriesList.map((cat) => (
                      <div className="form-check mb-2" key={cat}>
                        <input
                          className="form-check-input form-check-input-luxury"
                          type="checkbox"
                          id={`cat-${cat}`}
                          checked={selectedCategories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                        />
                        <label className="form-check-label small ms-1" htmlFor={`cat-${cat}`}>
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Filter */}
              <div className="accordion-item border-0 border-bottom">
                <h2 className="accordion-header" id="headingFilterPrice">
                  <button className="accordion-button collapsed px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilterPrice" aria-expanded="false" aria-controls="collapseFilterPrice">
                    Price Range
                  </button>
                </h2>
                <div id="collapseFilterPrice" className="accordion-collapse collapse" aria-labelledby="headingFilterPrice">
                  <div className="accordion-body px-0 pt-1 pb-3">
                    {priceRangesList.map((range) => (
                      <div className="form-check mb-2" key={range.value}>
                        <input
                          className="form-check-input form-check-input-luxury"
                          type="checkbox"
                          id={`price-${range.value}`}
                          checked={selectedPriceRanges.includes(range.value)}
                          onChange={() => handlePriceChange(range.value)}
                        />
                        <label className="form-check-label small ms-1" htmlFor={`price-${range.value}`}>
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Material Filter */}
              <div className="accordion-item border-0">
                <h2 className="accordion-header" id="headingFilterMaterial">
                  <button className="accordion-button collapsed px-0 py-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilterMaterial" aria-expanded="false" aria-controls="collapseFilterMaterial">
                    Material / Finish
                  </button>
                </h2>
                <div id="collapseFilterMaterial" className="accordion-collapse collapse" aria-labelledby="headingFilterMaterial">
                  <div className="accordion-body px-0 pt-1 pb-3">
                    {materialsList.map((mat) => (
                      <div className="form-check mb-2" key={mat}>
                        <input
                          className="form-check-input form-check-input-luxury"
                          type="checkbox"
                          id={`mat-${mat}`}
                          checked={selectedMaterials.includes(mat)}
                          onChange={() => handleMaterialChange(mat)}
                        />
                        <label className="form-check-label small ms-1" htmlFor={`mat-${mat}`}>
                          {mat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Column (Right) */}
        <div className="col-12 col-md-8 col-lg-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading products...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <h3 className="heading-serif text-muted mb-3">No products match your criteria.</h3>
              <button onClick={clearAllFilters} className="btn btn-luxury">
                Reset Filters
              </button>
            </div>
          ) : (selectedCategories.length === 0 && !searchParam) ? (
            /* Category-wise Section Grouping when viewing All Products */
            <div className="d-flex flex-column gap-5">
              {Object.entries(
                products.reduce((acc, p) => {
                  const cat = p.category || 'Other';
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(p);
                  return acc;
                }, {})
              ).map(([catName, catProducts]) => (
                <div key={catName} className="category-group-section">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                    <h3 className="heading-serif h5 text-dark mb-0 d-flex align-items-center gap-2">
                      <span style={{ color: '#AA771C' }}>◆</span> {catName}
                      <span className="badge bg-light text-dark border ms-2 fw-normal" style={{ fontSize: '0.75rem' }}>
                        {catProducts.length} {catProducts.length === 1 ? 'Item' : 'Items'}
                      </span>
                    </h3>
                    <button
                      onClick={() => setSelectedCategories([catName])}
                      className="btn btn-sm btn-link text-decoration-none p-0 fw-semibold"
                      style={{ fontSize: '0.85rem', color: '#AA771C' }}
                    >
                      View Only {catName} &rarr;
                    </button>
                  </div>
                  <ProductList products={catProducts} />
                </div>
              ))}
            </div>
          ) : (
            /* Single Category or Filtered View */
            <div>
              {selectedCategories.length === 1 && (
                <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                  <h3 className="heading-serif h5 text-dark mb-0 d-flex align-items-center gap-2">
                    <span style={{ color: '#AA771C' }}>◆</span> {selectedCategories[0]}
                    <span className="badge bg-light text-dark border ms-2 fw-normal" style={{ fontSize: '0.75rem' }}>
                      {products.length} {products.length === 1 ? 'Item' : 'Items'}
                    </span>
                  </h3>
                </div>
              )}
              <ProductList products={products} />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE OFFCANVAS FILTER BOTTOM SHEET (Opens when Filters pill is clicked) */}
      {/* ========================================================================= */}
      <div
        className="offcanvas offcanvas-bottom rounded-top-4"
        tabIndex="-1"
        id="mobileFilterOffcanvas"
        aria-labelledby="mobileFilterOffcanvasLabel"
        style={{ height: '75vh' }}
      >
        <div className="offcanvas-header border-bottom py-3">
          <h5 className="offcanvas-title heading-serif text-dark d-flex align-items-center gap-2" id="mobileFilterOffcanvasLabel">
            <FaSlidersH /> Filter Products
          </h5>
          <div className="d-flex align-items-center gap-3">
            {totalActiveFilters > 0 && (
              <button onClick={clearAllFilters} className="btn btn-link text-danger text-decoration-none small p-0">
                Clear All
              </button>
            )}
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
        </div>

        <div className="offcanvas-body p-4">
          <div className="accordion accordion-luxury border-0" id="mobileFilterAccordion">
            {/* Category Filter */}
            <div className="accordion-item border-0 border-bottom mb-2">
              <h2 className="accordion-header" id="mobileHeadingCategories">
                <button className="accordion-button px-0 py-2.5" type="button" data-bs-toggle="collapse" data-bs-target="#mobileCollapseCategories" aria-expanded="true" aria-controls="mobileCollapseCategories">
                  Categories
                </button>
              </h2>
              <div id="mobileCollapseCategories" className="accordion-collapse collapse show" aria-labelledby="mobileHeadingCategories">
                <div className="accordion-body px-0 pt-1 pb-3">
                  {categoriesList.map((cat) => (
                    <div className="form-check mb-2" key={`mob-${cat}`}>
                      <input
                        className="form-check-input form-check-input-luxury"
                        type="checkbox"
                        id={`mob-cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />
                      <label className="form-check-label small ms-1" htmlFor={`mob-cat-${cat}`}>
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Filter */}
            <div className="accordion-item border-0 border-bottom mb-2">
              <h2 className="accordion-header" id="mobileHeadingPrice">
                <button className="accordion-button collapsed px-0 py-2.5" type="button" data-bs-toggle="collapse" data-bs-target="#mobileCollapsePrice" aria-expanded="false" aria-controls="mobileCollapsePrice">
                  Price Range
                </button>
              </h2>
              <div id="mobileCollapsePrice" className="accordion-collapse collapse" aria-labelledby="mobileHeadingPrice">
                <div className="accordion-body px-0 pt-1 pb-3">
                  {priceRangesList.map((range) => (
                    <div className="form-check mb-2" key={`mob-${range.value}`}>
                      <input
                        className="form-check-input form-check-input-luxury"
                        type="checkbox"
                        id={`mob-price-${range.value}`}
                        checked={selectedPriceRanges.includes(range.value)}
                        onChange={() => handlePriceChange(range.value)}
                      />
                      <label className="form-check-label small ms-1" htmlFor={`mob-price-${range.value}`}>
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Material Filter */}
            <div className="accordion-item border-0 mb-2">
              <h2 className="accordion-header" id="mobileHeadingMaterial">
                <button className="accordion-button collapsed px-0 py-2.5" type="button" data-bs-toggle="collapse" data-bs-target="#mobileCollapseMaterial" aria-expanded="false" aria-controls="mobileCollapseMaterial">
                  Material / Finish
                </button>
              </h2>
              <div id="mobileCollapseMaterial" className="accordion-collapse collapse" aria-labelledby="mobileHeadingMaterial">
                <div className="accordion-body px-0 pt-1 pb-3">
                  {materialsList.map((mat) => (
                    <div className="form-check mb-2" key={`mob-${mat}`}>
                      <input
                        className="form-check-input form-check-input-luxury"
                        type="checkbox"
                        id={`mob-mat-${mat}`}
                        checked={selectedMaterials.includes(mat)}
                        onChange={() => handleMaterialChange(mat)}
                      />
                      <label className="form-check-label small ms-1" htmlFor={`mob-mat-${mat}`}>
                        {mat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="offcanvas-footer p-3 border-top bg-light">
          <button
            type="button"
            className="btn btn-luxury w-100 py-2.5"
            data-bs-dismiss="offcanvas"
          >
            Show {products.length} Products
          </button>
        </div>
      </div>
    </div>
  );
}
