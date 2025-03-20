import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <h1>Raising Confident Kids</h1>
          <p className="hero-subtitle">
            A research-backed approach to building confidence, resilience and purpose in children
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="features-section">
          <h2>The 5 Pillars of Confidence</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Independence & Problem-Solving</h3>
              <p>
                Help your child develop independence and problem-solving skills through the "Ask, Don't Tell" method and real-life scenarios.
              </p>
            </div>
            <div className="feature-card">
              <h3>Growth Mindset & Resilience</h3>
              <p>
                Foster a growth mindset and resilience in your child through the "Yet" technique and real-life scenarios.
              </p>
            </div>
            <div className="feature-card">
              <h3>Social Confidence & Communication</h3>
              <p>
                Build social confidence and communication skills through the "Conversation Challenge" and real-life scenarios.
              </p>
            </div>
            <div className="feature-card">
              <h3>Purpose & Strength Discovery</h3>
              <p>
                Help your child discover their purpose and strengths through the "Strength Journal" exercise and real-life scenarios.
              </p>
            </div>
            <div className="feature-card">
              <h3>Managing Fear & Anxiety</h3>
              <p>
                Help your child manage fear and anxiety through the "Reframe the Fear" technique and real-life scenarios.
              </p>
            </div>
          </div>
        </section>

        <section className="how-it-works-section">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create an Account</h3>
              <p>Sign up and add your children's profiles with their ages.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Explore the 5 Pillars</h3>
              <p>Learn about each pillar and the techniques to build confidence.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Complete Daily Challenges</h3>
              <p>Implement daily challenges with your children.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Track Progress</h3>
              <p>Monitor your child's confidence growth over time.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Build Your Child's Confidence?</h2>
          <p>Join thousands of parents who are helping their children develop confidence, resilience, and purpose.</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Get Started Today
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
