import React, { useMemo, useState, useRef, useEffect } from 'react';
import CloudinaryUploader from "./components/Cloudnairy.jsx";
import axios from 'axios';

const imagePaths = {
  RVlogo: '/images/RVlogo.png',
  fotter1: '/images/fotter1.png',
  bluegiftcard: '/images/Bluegiftcard.png',
  redgiftcard: '/images/RedGiftcard.png',
  tree1: '/images/tree1.png',
};

// Image error handler component
const SafeImage = ({ src, alt, className, style, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setImageError(true);
  };

  const handleLoad = () => {
    console.log(`Successfully loaded image: ${src}`);
    setImageLoaded(true);
  };

  if (imageError) {
    return (
      <div
        className={className}
        style={{
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px',
          border: '2px dashed #ccc',
          ...style
        }}
        {...props}
      >
        ❌ Failed to load: {alt}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: imageLoaded ? 1 : 0.5,
        transition: 'opacity 0.3s ease'
      }}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

const posterCards = [
  {
    theme: 'night',
    image: imagePaths.bluegiftcard,
    title: 'Christmas Poster',
    caption: 'Festive Christmas design for your business'
  },

  {
    theme: 'christmas',
    image: imagePaths.redgiftcard,
    title: 'New Year Poster',
    caption: 'Celebrate New Year with style'
  },
];

const services = [
  { label: "Web Development", icon: <i className="fas fa-code"></i> },
  {
    label: "Mobile - App Development",
    icon: <i className="fas fa-mobile"></i>,
  },
  { label: "UI - UX Designing", icon: <i className="fas fa-palette"></i> },
  {
    label: "IT Consultancy & support",
    icon: <i className="fas fa-headset"></i>,
  },
];

const socials = [
  // { name: 'Facebook', href: 'https://facebook.com', icon: <i className="fab fa-facebook"></i> },
  // { name: 'LinkedIn', href: '', icon: <i className="fab fa-linkedin"></i> },
  // { name: 'Instagram', href: 'https://www.instagram.com/reimvibetechnologies?igsh=MTltbmM3YmtnemN4Mw', icon: <i className="fab fa-instagram"></i> },
];

export default function App() {
  const [formValues, setFormValues] = useState({
    fullName: "",
    businessName: "",
    email: "",
    address: "",
    businessLogo: "",
    contact: "",
  });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (window.location.protocol === 'http:' && window.location.hostname === 'www.reimvibetechnologies.com') {
      window.location.href = 'https://www.reimvibetechnologies.com/';
    }
  }, []);

  useEffect(() => {
    // Hide loader when page is fully loaded
    const handleLoad = () => setIsLoading(true);

    if (document.readyState === 'complete') {
      setIsLoading(true);
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const canSubmit = useMemo(
    () =>
      formValues.fullName.trim() &&
      formValues.businessName.trim() &&
      formValues.email.trim() &&
      formValues.address.trim() &&
      formValues.contact.trim(),
    [formValues]
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

    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

    try {
      const response = await axios.post(GOOGLE_SCRIPT_URL, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("Google Sheet Response:", response.data);
      setStatus({ type: "success", message: "Form submitted successfully!" });
      setFormValues({
        fullName: "",
        businessName: "",
        email: "",
        address: "",
        businessLogo: "",
        contact: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Submission failed. Please try again.",
      });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      {isLoading && <PageLoader />}
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
                  type="text"
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
                  type="text"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="Add Address"
                  required
                />
              </label>
              <label className="form__label">
                Business Logo (optional)
                <CloudinaryUploader
                  onUpload={(url) =>
                    setFormValues((prev) => ({ ...prev, businessLogo: url }))
                  }
                />
              </label>
              <label className="form__label">
                Contact No
                <input
                  type="tel"
                  name="contact"
                  value={formValues.contact}
                  onChange={handleChange}
                  placeholder="+91"
                  minLength={10}
                  maxLength={10}
                  required
                />
              </label>
              <button
                type="submit"
                className="btn"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit"
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
          <div className={`poster poster--${theme}`}>
            <div className="poster__overlay" />
            <div className="poster__content">
              <p className="poster__title">{title}</p>
              <p className="poster__caption">{caption}</p>
              <img src={} alt="abc" />
            </div>
            <div className="poster__accent" style={{ background: accent }} />
          </div>
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

        <div className="festive-elements">
          <div className="festive-card tree-card" aria-hidden="true">
            <div className="tree-card__tree"></div>
          </div>
          {/*<div className="festive-card santa-card" aria-hidden="true">
            <SafeImage src={imagePaths.santa} alt="Santa Claus" className="festive-image" />
          </div>
          <div className="festive-card gift-card" aria-hidden="true">
            <SafeImage src={imagePaths.gift} alt="Christmas Gift" className="festive-image" />
          </div> */}
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
          <div className="contact-item">
            📞 +91 75730 80196, +91 70166 91326
          </div>
          <a
            href="mailto:info@reimvibetechnologies.com"
            className="contact-item"
          >
            ✉️ info@reimvibetechnologies.com
          </a>
          <a
            href="http://www.reimvibetechnologies.com"
            className="contact-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐www.reimvibetechnologies.com
          </a>
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

        <SafeImage
          src={imagePaths.fotter1}
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
        <SafeImage
          src={imagePaths.RVlogo}
          alt="ReimVibe Technologies Logo"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <span className="logo__text">ReimVibe Technologies</span>
    </div>
  );
}

function PosterCard({ title, caption, theme, image }) {
  return (
    <div className={`poster poster--${theme}`}>
      <div className="poster__overlay" />
      <div className="poster__content">
        <p className="poster__title">{title}</p>
        <p className="poster__caption">{caption}</p>
        <img src={Image} alt="abc" />
      </div>
      {image && <SafeImage src={image} className="poster__image" alt={`${theme} poster`} />}
    </div>
  );
}
