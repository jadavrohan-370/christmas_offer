import React, { useMemo, useState, useRef } from 'react';
import CloudinaryUploader from "./components/Cloudnairy.jsx";
import axios from 'axios';
import RVlogo from './Image/RVlogo.png';
import fotter1 from './Image/fotter1.png';

const posterCards = [
  {
    theme: 'night',
    Image: '🌃',
  },
  {
    theme: 'christmas',
    accent: '#a0171e',
  },
];

const services = [
  { label: 'Web Development', icon: <i className="fas fa-code"></i> },
  { label: 'Mobile - App Development', icon: <i className="fas fa-mobile"></i> },
  { label: 'UI - UX Designing', icon: <i className="fas fa-palette"></i> },
  { label: 'IT Consultancy & support', icon: <i className="fas fa-headset"></i> },
];

const socials = [
  { name: 'Facebook', href: 'https://facebook.com', icon: <i className="fab fa-facebook"></i> },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: <i className="fab fa-linkedin"></i> },
  { name: 'Instagram', href: 'https://instagram.com', icon: <i className="fab fa-instagram"></i> },
];


export default function App() {
  const [formValues, setFormValues] = useState({
    fullName: '',
    businessName: '',
    email: '',
    address: '',
    businessLogo: '',
    contact: '',
  });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => formValues.fullName.trim() && formValues.businessName.trim() && formValues.email.trim() && formValues.address.trim() && formValues.contact.trim(),
    [formValues],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const params = new URLSearchParams();
    params.append("fullName", formValues.fullName);
    params.append("businessName", formValues.businessName);
    params.append("email", formValues.email);
    params.append("address", formValues.address);
    params.append("contact", formValues.contact);
    params.append("businessLogo", formValues.businessLogo || "");

    console.log("Sending:", params.toString());

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzMW6XwWg_wERt5zlXsLcGqKN8HK5g7JSvacijYT-T2Zn5RjaEjQn0KzIb-QlQxM6ag5Q/exec";

    try {
      const response = await axios.post(GOOGLE_SCRIPT_URL, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      console.log("Google Sheet Response:", response.data);
      setStatus({ type: 'success', message: 'Form submitted successfully!' });
      setFormValues({
        fullName: '',
        businessName: '',
        email: '',
        address: '',
        businessLogo: '',
        contact: '',
      });
    } catch (error) {
      setStatus({ type: 'error', message: 'Submission failed. Please try again.' });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <GradientBackground />
      <header className="hero section site-header">
        <div className="hero__copy">
          <Logo />
          <p className="eyebrow">A Festive Gift for You!</p>
          <h3 className="headline">
            Let your business celebrate with free Christmas &amp; New Year
            creatives.
          </h3>
          <p className="body">
            Register now and receive a professionally designed Christmas &amp;
            New Year poster/flyer absolutely free. Whether you&apos;re a
            business, brand, or company, this festive gift is for all
            registrants.
          </p>
          <p className="body">
            Don&apos;t miss this chance to start the New Year with fresh,
            festive creatives.
          </p>
        </div>
        <div className="hero__form">
          <div className="card">
            <h2 className="card__title">Free Registration Form</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label className="form__label">
                Full Name*
                <input
                  type="text"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                />
              </label>
              <label className="form__label">
                Business Name
                <input
                  type='text'
                  name="businessName"
                  value={formValues.businessName}
                  onChange={handleChange}
                  placeholder="ReimVibe Technologies"
                  required
                />
              </label>
              <label className="form__label">
                Email Address*
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="form__label">
                Address
                <input
                  type='text'
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="Add Address"
                  required
                />
              </label>
              <label className="form__label">
                Business Logo (optional)
                <CloudinaryUploader onUpload={(url) => setFormValues((prev) => ({ ...prev, businessLogo: url }))} />
              </label>
              <label className="form__label">
                Contact No
                <input
                  type='tel'
                  name="contact"
                  value={formValues.contact}
                  onChange={handleChange}
                  placeholder="+91"
                  minLength={10}
                  maxLength={10}
                  required
                />
              </label>
              <button type="submit" className="btn" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
              {status && (
                <p
                  className={`form__status form__status--${status.type}`}
                  role="status"
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </header>

      <section className="section">
        <p className="eyebrow center">
          Free Poster For Christmas &amp; New Year
        </p>
        <div className="poster-grid">
          {posterCards.map((poster) => (
            <PosterCard key={poster.theme} {...poster} />
          ))}
        </div>
      </section>

      <section className="section section--two-column">
        <div>
          <p className="eyebrow">Christmas wish and party</p>
          <p className="body">
            Fill your Christmas holiday with joyful decorations, and
            unforgettable experiences. Join our festive event with your family
            and children, and celebrate the most magical holiday of the year.
            From heartwarming carols to fun activities for all ages, there is
            something special for everyone.
          </p>
          <p className="body strong">
            Register now and receive an exclusive Christmas and New Year poster
            and flyer—absolutely free!
          </p>
        </div>
        <div className="tree-card" aria-hidden="true">
          <div className="tree-card__tree">
            {/* <img src="Image/tree2.png"/>background-image:url(../Image/tree2.png);
  width: 160px;
  height: 200px;
 */}
          </div>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow center">Our Services</p>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.label} className="service-pill">
              <span className="service-pill__icon" aria-hidden="true">
                {service.icon}
              </span>
              <span>{service.label}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="section footer">
        <p className="eyebrow center">Stay In Touch</p>
        <div className="footer__contacts">
          <div className="contact-item">📞 +91 75730 80196, +91 70166 91326</div>
          <div className="contact-item">✉️ info@reimvibetechnologies.com</div>
        </div>
        <div className="socials">
          {socials.map((social) => (
            <a
              key={social.name}
              className="socials__link"
              href={social.href}
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">{social.icon}</span> {social.name}
            </a>
          ))}
        </div>
        <img
          src={fotter1}
          className="img-fluid footer-image"
          alt="Festive Christmas and New Year poster design featuring celebratory decorations and seasonal elements in a joyful, warm atmosphere"
        />
      </footer>
    </div>
  );
}

function GradientBackground() {
  return <div className="bg-gradient" aria-hidden="true" />;
}

function Logo() {
  return (
    <div className="logo">
      <div className="logo__mark">
        <img src={RVlogo} alt="ReimVibe Technologies Logo" />
      </div>
      <span className="logo__text">ReimVibe Technologies</span>
    </div>
  );
}

function PosterCard({ title, caption, theme, accent }) {
  return (
    <div className={`poster poster--${theme}`}>
      <div className="poster__overlay" />
      <div className="poster__content">
        <p className="poster__title">{title}</p>
        <p className="poster__caption">{caption}</p>
      </div>
      <div className="poster__accent" style={{ background: accent }} />
    </div>
  );
}