import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// We'll define simple SVG icons directly in the component
// This is lightweight and avoids needing a whole icon library for just a few icons.

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);


const Home = () => {
  return (
    <div className="home-page-container">
      <header className="home-header">
        <div className="logo">QuickServe</div>
        <nav>
          {/* We'll add dynamic links here later based on login status */}
          <Link to="/login" className="nav-link sign-in-link">Sign In</Link>
        </nav>
      </header>

      <main className="home-main-content">
        <section className="hero-section">
          <h1>
            Find & Book Local Services,
            <br />
            <span className="highlight-text">Instantly.</span>
          </h1>
          <p className="hero-subtitle">
            Get connected with trusted local professionals for any job, big or small.
            <br />
            Your one-stop solution for electricians, plumbers, tutors, and more.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Start Finding Services</Link>
            <Link to="/signup" className="btn btn-secondary">Become a Provider</Link>
          </div>
        </section>

        <section className="features-section">
          <div className="feature-card">
            <div className="icon-container">
              <SearchIcon />
            </div>
            <h3>Discover Experts</h3>
            <p>Search and filter through a wide range of top-rated local service providers in your area.</p>
          </div>
          <div className="feature-card">
            <div className="icon-container">
              <CalendarIcon />
            </div>
            <h3>Easy Booking</h3>
            <p>Check real-time availability and book appointments instantly with a simple, intuitive calendar.</p>
          </div>
          <div className="feature-card">
            <div className="icon-container">
               <StarIcon />
            </div>
            <h3>Verified Reviews</h3>
            <p>Make confident decisions by reading authentic reviews and ratings from other customers.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
