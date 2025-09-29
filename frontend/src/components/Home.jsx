// Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { properties, users} from "../mockData";

const Home = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState(properties);

  // 模拟登录用户
  const [user, setUser] = useState(users);

  // 搜索状态
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);

  // Agent AI 面板状态
  const [showAgent, setShowAgent] = useState(false);

  const handleSearch = () => {
    const filtered = properties.filter((p) =>
      p.city.toLowerCase().includes(location.toLowerCase())
    );
    setProperties(filtered);
  };

  const toggleFavorite = (id) => {
    const updated = properties.map((p) =>
      p.id === id ? { ...p, favorited: !p.favorited } : p
    );
    setProperties(updated);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <span
          className="navbar-brand fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Airbnb Prototype
        </span>
        <div className="ms-auto">
          {!user ? (
            <>
              <button
                className="btn btn-light text-primary me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-light text-primary"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <button
              className="btn btn-light text-primary"
              onClick={() => navigate("/dashboard")}
            >
              {user.name}
            </button>
          )}
        </div>
      </nav>

      {/* Search Section */}
      <div className="bg-light p-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Guests</label>
            <input
              type="number"
              value={guests}
              min={1}
              onChange={(e) => setGuests(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <button onClick={handleSearch} className="btn btn-primary w-100">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Property List */}
      <div className="container my-4">
        <div className="row g-4">
          {properties.map((property) => (
            <div key={property.id} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={property.image}
                  alt={property.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{property.name}</h5>
                  <p className="card-text">
                    {property.type} - {property.city}, {property.country}
                  </p>
                  <p className="card-text fw-bold">${property.price} / night</p>
                  <p className="card-text">
                    {property.bedrooms} Beds · {property.bathrooms} Baths
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className={`btn ${
                      property.favorited ? "btn-danger" : "btn-outline-secondary"
                    }`}
                  >
                    {property.favorited ? "★ Favorited" : "☆ Favorite"}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent AI Button */}
      <button
        onClick={() => setShowAgent(!showAgent)}
        className="btn btn-success rounded-circle p-3 shadow position-fixed"
        style={{ bottom: "20px", right: "20px" }}
      >
        Agent AI
      </button>

      {/* Agent AI Panel */}
      {showAgent && (
        <div
          className="position-fixed top-0 end-0 bg-white shadow p-4 h-100"
          style={{ width: "320px", zIndex: 1050 }}
        >
          <h5 className="fw-bold">Agent AI</h5>
          <p>Here will show day-by-day plans and activity cards...</p>
          <button
            onClick={() => setShowAgent(false)}
            className="btn btn-danger mt-3"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
