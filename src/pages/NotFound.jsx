import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <div className="py-5 bg-white border shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <h1 className="display-1 heading-serif text-danger mb-3">404</h1>
        <h2 className="heading-serif mb-3">Page Not Found</h2>
        <p className="text-secondary small mb-5 px-4" style={{ lineHeight: '1.8' }}>
          The heritage art piece or page you are looking for has been moved, removed, or is temporarily unavailable. 
          Please return to our homepage to continue exploring our collections.
        </p>
        <Link to="/" className="btn btn-luxury px-5 py-3 fw-bold">
          RETURN TO HOME
        </Link>
      </div>
    </div>
  );
}
