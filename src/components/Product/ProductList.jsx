import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-5 w-100">
        <h4 className="heading-serif text-muted">No Products Found</h4>
        <p className="small text-secondary">Try adjusting your filters or search queries to find what you are looking for.</p>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
      {products.map((product) => (
        <div key={product.id} className="col">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
