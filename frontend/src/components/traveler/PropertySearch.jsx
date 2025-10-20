import React, { useState } from 'react';

const PropertySearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    location: '',
    startDate: '',
    endDate: '',
    guests: ''
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Search Properties</h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="City, State or City, Country (e.g., Fremont, CA)"
              />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label">Guests</label>
              <input
                type="number"
                className="form-control"
                name="guests"
                value={filters.guests}
                onChange={handleChange}
                placeholder="Number of guests"
                min="1"
              />
            </div>
            <div className="col-md-2 mb-3 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                Search
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mb-3 d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setFilters({
                  location: '',
                  startDate: '',
                  endDate: '',
                  guests: ''
                })}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertySearch;
