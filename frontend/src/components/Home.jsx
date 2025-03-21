import React from 'react';
import { Link } from 'react-router-dom';
import { FaChild, FaChartLine, FaTrophy, FaCalendarAlt, FaCrown } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="dashboard-welcome mt-4">
        <h1>Build Your Child's Confidence</h1>
        <p>A research-based approach to help parents nurture confident, resilient children.</p>
        <div className="mt-4">
          <Link to="/register" className="btn btn-primary me-3">Get Started</Link>
          <Link to="/login" className="btn btn-outline">Log In</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-5">
        <h2 className="text-center mb-4">The 5 Pillars of Confidence</h2>
        <div className="grid-3">
          <div className="pillar-card pillar-card-1">
            <div className="pillar-card-header">
              <h3>Independence & Problem Solving</h3>
            </div>
            <div className="pillar-card-body">
              <p>Help your child develop the skills to tackle challenges on their own and find solutions to problems.</p>
            </div>
          </div>
          
          <div className="pillar-card pillar-card-2">
            <div className="pillar-card-header">
              <h3>Growth Mindset & Resilience</h3>
            </div>
            <div className="pillar-card-body">
              <p>Teach your child to embrace challenges, persist through setbacks, and see effort as a path to mastery.</p>
            </div>
          </div>
          
          <div className="pillar-card pillar-card-3">
            <div className="pillar-card-header">
              <h3>Social Confidence & Communication</h3>
            </div>
            <div className="pillar-card-body">
              <p>Build your child's ability to express themselves, connect with others, and navigate social situations.</p>
            </div>
          </div>
          
          <div className="pillar-card pillar-card-4">
            <div className="pillar-card-header">
              <h3>Purpose & Strength Discovery</h3>
            </div>
            <div className="pillar-card-body">
              <p>Help your child identify their unique strengths and develop a sense of purpose and direction.</p>
            </div>
          </div>
          
          <div className="pillar-card pillar-card-5">
            <div className="pillar-card-header">
              <h3>Managing Fear & Anxiety</h3>
            </div>
            <div className="pillar-card-body">
              <p>Equip your child with tools to understand and manage their emotions, particularly fear and anxiety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mt-5">
        <h2 className="text-center mb-4">How It Works</h2>
        <div className="grid-3">
          <div className="card">
            <div className="card-body text-center">
              <FaChild className="mb-3" size={48} color="#6a1b9a" />
              <h3>Create Child Profiles</h3>
              <p>Add profiles for each of your children to receive age-appropriate activities and track their progress.</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <FaChartLine className="mb-3" size={48} color="#6a1b9a" />
              <h3>Track Progress</h3>
              <p>Monitor your child's confidence journey with detailed progress tracking across all five pillars.</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <FaTrophy className="mb-3" size={48} color="#6a1b9a" />
              <h3>Earn Rewards</h3>
              <p>Celebrate achievements with printable certificates and redeemable rewards to keep your child motivated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mt-5">
        <h2 className="text-center mb-4">Choose Your Plan</h2>
        <div className="plan-options">
          <div className="plan-card">
            <h3>Free</h3>
            <div className="price">$0 <span>/month</span></div>
            <p>Basic features to get started</p>
            <ul className="features">
              <li>One recommended activity per pillar</li>
              <li>Basic child profile management</li>
              <li>Limited progress tracking</li>
            </ul>
            <Link to="/register" className="btn btn-outline w-100">Sign Up Free</Link>
          </div>
          
          <div className="plan-card">
            <div className="best-value">Best Value</div>
            <h3>Premium</h3>
            <div className="price">$9.99 <span>/month</span></div>
            <p>Full access to all features</p>
            <ul className="features">
              <li>Full access to all 5 pillars</li>
              <li>Unlimited activities and challenges</li>
              <li>Progress tracking for multiple children</li>
              <li>Printable certificates</li>
              <li>Rewards marketplace</li>
              <li>Social sharing capabilities</li>
            </ul>
            <Link to="/register" className="btn btn-primary w-100">Get Started</Link>
          </div>
          
          <div className="plan-card">
            <h3>Annual</h3>
            <div className="price">$89.99 <span>/year</span></div>
            <div className="savings">Save $29.89 per year</div>
            <p>All premium features at a discount</p>
            <ul className="features">
              <li>All Premium features</li>
              <li>Priority support</li>
              <li>Early access to new features</li>
            </ul>
            <Link to="/register" className="btn btn-outline w-100">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mt-5 mb-5">
        <h2 className="text-center mb-4">What Parents Say</h2>
        <div className="grid-2">
          <div className="card">
            <div className="card-body">
              <p className="mb-3">"Since using Confident Kids, my daughter has become much more willing to try new things and speak up in class. The activities are easy to implement and really work!"</p>
              <div className="text-right">
                <strong>- Sarah M., mother of 8-year-old</strong>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <p className="mb-3">"The structured approach to building confidence has been a game-changer for my son. He's now able to manage his anxiety much better and has made new friends at school."</p>
              <div className="text-right">
                <strong>- Michael T., father of 10-year-old</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="upgrade-prompt standard mt-5 mb-5">
        <h3><FaCrown className="me-2" /> Start Your Child's Confidence Journey Today</h3>
        <p>Join thousands of parents who are helping their children build lasting confidence and resilience.</p>
        <Link to="/register" className="upgrade-button">Get Started Now</Link>
      </section>
    </div>
  );
};

export default Home;
