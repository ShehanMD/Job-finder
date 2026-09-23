import React from 'react';
import { Users, Globe, ShieldCheck, Award, Cloud, Star } from 'lucide-react';
import './about.css';

export default function About() {
  return (
    <div className="about-page-wrapper">
      <div className="about-container">
        
        {/* Header Section */}
        <div className="about-header">
          <h1 className="about-title">About <span>Us</span></h1>
          <p className="about-intro-text">
            <span className="purpose-highlight">Hotjobs</span> is a modern recruitment platform built by <span className="purpose-highlight">Careers360</span>, 
            created to make hiring smarter for employers and job searching easier for candidates. With intuitive technology, data-driven and AI tools, 
            HotJobs simplifies the entire recruitment journey from discovering opportunities to making confident hiring decisions.
          </p>
          <p className="about-intro-text">
            Careers360 is a joint venture between <span className="purpose-highlight">InTalent Asia</span> and <span className="purpose-highlight">InspireX Global</span>, 
            combining proven expertise in talent solutions and digital innovation to deliver innovative career and recruitment solutions across Sri Lanka and beyond.
          </p>
        </div>

        {/* Purpose Section */}
        <div className="purpose-section">
          <h2 className="purpose-title">Our Purpose</h2>
          <p className="purpose-text">
            At HotJobs, we believe recruitment should be simple, intelligent, and fair. In a market crowded with traditional job portals, 
            we stand apart by using AI-powered tools and automation to efficiently connect both employers and jobseekers.
          </p>
          <p className="purpose-text">
            Our platform goes beyond basic job listings. With features such as <span className="purpose-highlight">automatic candidate screening with percentage match scoring, intelligent screening chatbots, recruitment analytics, and smart application workflows</span>, 
            we help employers make faster, data-driven hiring decisions and not just collect CVs.
          </p>
          <p className="purpose-text">
            Similarly, HotJobs is built to <span className="purpose-highlight">make jobseekers' lives easier</span>. From CV-less Quick Apply options to smarter job matching and simplified applications, 
            we remove unnecessary barriers and help candidates focus on what truly matters: finding the right opportunity.
          </p>
        </div>

        {/* Partners Section */}
        <div className="partners-section">
          <h2 className="partners-title">Our Partners</h2>
          <div className="partners-grid">
            
            {/* Partner 1 */}
            <div className="partner-card">
              <div className="partner-icon-wrapper">
                <Users size={40} />
              </div>
              <h3 className="partner-name">InTalent Asia</h3>
              <p className="partner-desc">
                InTalent Asia is a leading global HR services and talent solutions provider. We bring deep industry knowledge and expertise 
                to support organizations at every stage of their career journey, ensuring they find the best talent suited for their specific needs.
              </p>
            </div>

            {/* Partner 2 */}
            <div className="partner-card">
              <div className="partner-icon-wrapper">
                <Globe size={40} />
              </div>
              <h3 className="partner-name">InspireX Global</h3>
              <p className="partner-desc">
                InspireX Global is a technology and consulting company specializing in digital transformation and innovative software engineering. 
                We bring the cutting-edge technology platforms that power modern recruitment systems globally.
              </p>
            </div>
            
          </div>
        </div>

        {/* Trust Badges Section (Optional - to match the footer vibe in screenshots) */}
        <div className="trust-section">
          <div className="trust-item">
            <ShieldCheck size={24} color="#00c49f" />
            <span>SSL Secured</span>
          </div>
          <div className="trust-item">
            <Star size={24} color="#00c49f" />
            <span>Trustpilot Rated</span>
          </div>
          <div className="trust-item">
            <Cloud size={24} color="#00c49f" />
            <span>AWS Hosted</span>
          </div>
          <div className="trust-item">
            <Award size={24} color="#00c49f" />
            <span>BestWeb.lk Winner</span>
          </div>
        </div>

      </div>
    </div>
  );
}