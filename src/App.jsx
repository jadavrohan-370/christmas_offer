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
    setImageError(true);
  };

  const handleLoad = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (window.location.protocol === 'http:' && window.location.hostname === 'www.reimvibetechnologies.com') {
      window.location.href = 'https://www.reimvibetechnologies.com/';
    }
  }, []);

  useEffect(() => {
    // Hide loader when page is fully loaded
    const handleLoad = () => setIsLoading(false);

    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return !value.trim() ? 'Full name is required' : '';
      case 'businessName':
        return !value.trim() ? 'Business name is required' : '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'address':
        return !value.trim() ? 'Address is required' : '';
      case 'contact':
        if (!value.trim()) return 'Contact number is required';
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return !phoneRegex.test(value) ? 'Please enter a valid contact number' : '';
      default:
        return '';
    }
  };

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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Pre-validate all required fields
    const requiredFields = ['fullName', 'businessName', 'email', 'address', 'contact'];
    const newErrors = {};
    const newTouched = {};
    let hasErrors = false;

    // Validate and mark all fields as touched
    requiredFields.forEach(field => {
      const error = validateField(field, formValues[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
      newTouched[field] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    // If there are validation errors, show message and stop
    if (hasErrors) {
      setStatus({ 
        type: "error", 
        message: "Please fill in all required fields correctly before submitting." 
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    // Prepare form data with proper handling of empty values
    const params = new URLSearchParams();
    params.append("fullName", formValues.fullName);
    params.append("businessName", formValues.businessName);
    params.append("email", formValues.email);
    params.append("address", formValues.address);
    params.append("contact", formValues.contact);
    params.append("businessLogo", formValues.businessLogo || "");

    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

    try {
      const response = await axios.post(GOOGLE_SCRIPT_URL, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      setStatus({ type: "success", message: "Form submitted successfully!" });
      setFormValues({
        fullName: "",
        businessName: "",
        email: "",
        address: "",
        businessLogo: "",
        contact: "",
      });

      // Clear all validation states
      setErrors({});
      setTouched({});
      
      // Reset the upload component
      setResetKey(prev => prev + 1);
      
      // Auto-hide success message after 8 seconds
      setTimeout(() => {
        setStatus(null);
      }, 8000);
      
    } catch (error) {
      setStatus({
        type: "error",
        message: "Submission failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <PageLoader isLoading={isLoading} />
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
              <label className={`form__label ${getFieldError('fullName') ? 'form__label--error' : ''}`}>
                <span className="form__label-text">Full Name*</span>
                <input
                  type="text"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Jane Doe"
                  className={getFieldError('fullName') ? 'form__input--error' : ''}
                />
                {getFieldError('fullName') && (
                  <span className="form__error-message">{getFieldError('fullName')}</span>
                )}
              </label>
              
              <label className={`form__label ${getFieldError('businessName') ? 'form__label--error' : ''}`}>
                <span className="form__label-text">Business Name</span>
                <input
                  type="text"
                  name="businessName"
                  value={formValues.businessName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="ReimVibe Technologies"
                  className={getFieldError('businessName') ? 'form__input--error' : ''}
                />
                {getFieldError('businessName') && (
                  <span className="form__error-message">{getFieldError('businessName')}</span>
                )}
              </label>
              
              <label className={`form__label ${getFieldError('email') ? 'form__label--error' : ''}`}>
                <span className="form__label-text">Email Address*</span>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className={getFieldError('email') ? 'form__input--error' : ''}
                />
                {getFieldError('email') && (
                  <span className="form__error-message">{getFieldError('email')}</span>
                )}
              </label>
              
              <label className={`form__label ${getFieldError('address') ? 'form__label--error' : ''}`}>
                <span className="form__label-text">Address</span>
                <input
                  type="text"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Add Address"
                  className={getFieldError('address') ? 'form__input--error' : ''}
                />
                {getFieldError('address') && (
                  <span className="form__error-message">{getFieldError('address')}</span>
                )}
              </label>
              

              <label className="form__label">
                Business Logo (optional)
                <CloudinaryUploader
                  onUpload={(url) =>
                    setFormValues((prev) => ({ ...prev, businessLogo: url }))
                  }
                />
              </label>
              
              <label className={`form__label ${getFieldError('contact') ? 'form__label--error' : ''}`}>
                <span className="form__label-text">Contact No</span>
                <input
                  type="tel"
                  name="contact"
                  value={formValues.contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+91"
                  minLength={10}
                  maxLength={10}
                  className={getFieldError('contact') ? 'form__input--error' : ''}
                />
                {getFieldError('contact') && (
                  <span className="form__error-message">{getFieldError('contact')}</span>
                )}
              </label>
              <button
                type="submit"
                className="btn"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    <span className="btn__text">Submitting...</span>
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
          {posterCards.map((card, index) => (
            <PosterCard
              key={index}
              title={card.title}
              caption={card.caption}
              theme={card.theme}
              image={card.image}
            />
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
      </div>
      {image && <SafeImage src={image} className="poster__image" alt={`${theme} poster`} />}
    </div>
  );
}

function PageLoader({ isLoading }) {
  return (
    <div className={`page-loader ${!isLoading ? 'fade-out' : ''}`}>
      <div className="loader-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loader-text">Loading...</p>
    </div>
  );
}
