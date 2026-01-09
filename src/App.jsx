import React, { useMemo, useState, useRef, useEffect } from "react";
import CloudinaryUploader from "./components/Cloudnairy.jsx";
import axios from "axios";
import Lenis from "lenis";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const imagePaths = {
  RVlogo: "/images/RVlogo.png",
  patang1: "/images/patan1.jpeg",
  patang2: "/images/patan2.jpeg",
  kite1: "/images/patan1.png",
  kite2: "/images/patan2.png",
  kite3: "/images/santa.png",
  banner: "/images/p3.jpeg",
  mainkite: "/images/leftside.png",
  footer: "/images/footer.png",
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
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
          fontSize: "14px",
          border: "2px dashed #ccc",
          ...style,
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
        transition: "opacity 0.3s ease",
      }}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

const posterCards = [
  {
    theme: "kite",
    image: imagePaths.patang2,
    title: " Kites Festival Poster",
    caption: "Festive Christmas design for your business",
  },

  {
    theme: "kite2",
    image: imagePaths.patang1,
    title: " Poster",
    caption: "Celebrate  with style",
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
  const containerRef = useRef(null);

  // GSAP Animations
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Hero Entrance
      tl.from(".hero__copy > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        delay: 0.5,
      })
        .from(
          ".hero__form .card",
          {
            y: 60,
            opacity: 0,
            duration: 1,
            scale: 0.95,
          },
          "-=0.8"
        )
        .from(
          ".festive-card",
          {
            x: -30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
          },
          "-=0.5"
        );

      // Parallax Effect for floating kites using ScrollTrigger
      gsap.utils.toArray(".floating-kite").forEach((kite, i) => {
        gsap.to(kite, {
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
          y: (i + 1) * -150, // Move up at different speeds
          rotation: (i + 1) * 20,
          ease: "none",
        });
      });

      // Poster Flip Animation
      gsap.from(".poster", {
        scrollTrigger: {
          trigger: ".poster-grid",
          start: "top 80%", // Start animation when top of grid hits 80% of viewport height
        },
        y: 100,
        opacity: 0,
        rotationX: -15,
        stagger: 0.2, // Flip in one by one
        duration: 1,
        ease: "power4.out"
      });

      // Magnetic Kites - Mouse Follow Effect
      const kites = document.querySelectorAll(".kite-decoration");

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Calculate distance from center (-1 to 1)
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        kites.forEach((kite, index) => {
          const depth = (index + 1) * 20; // Different depth for each kite

          gsap.to(kite, {
            x: moveX * depth,
            y: moveY * depth,
            duration: 1,
            ease: "power2.out"
          });
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: containerRef }
  );

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
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (
      window.location.protocol === "http:" &&
      window.location.hostname === "www.reimvibetechnologies.com"
    ) {
      window.location.href = "https://www.reimvibetechnologies.com/";
    }
  }, []);

  useEffect(() => {
    // Hide loader when page is fully loaded
    const handleLoad = () => setIsLoading(false);

    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return !value.trim() ? "Full name is required" : "";
      case "businessName":
        return !value.trim() ? "Business name is required" : "";
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address"
          : "";
      case "address":
        return !value.trim() ? "Address is required" : "";
      case "contact":
        if (!value.trim()) return "Contact number is required";
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return !phoneRegex.test(value)
          ? "Please enter a valid contact number"
          : "";
      default:
        return "";
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
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : "";
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
    setStatus(null);
    setFormValues({
      fullName: "",
      businessName: "",
      email: "",
      address: "",
      businessLogo: "",
      contact: "",
    });
    setErrors({});
    setTouched({});
    setResetKey((prev) => prev + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Pre-validate all required fields
    const requiredFields = [
      "fullName",
      "businessName",
      "email",
      "address",
      "contact",
    ];
    const newErrors = {};
    const newTouched = {};
    let hasErrors = false;

    // Validate and mark all fields as touched
    requiredFields.forEach((field) => {
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
        message:
          "Please fill in all required fields correctly before submitting.",
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
      setResetKey((prev) => prev + 1);

      // Auto-hide success message after 8 seconds
      setTimeout(() => {
        setStatus(null);
      }, 8000);

      // Set submitted state to hide form and show success state
      setIsSubmitted(true);
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
    <div className="page" ref={containerRef}>
      <PageLoader isLoading={isLoading} />
      <GradientBackground />
      <header className="hero section site-header">
        <div className="uttarayan-banner uttarayan-banner--left">🎯 🪁 ✨</div>
        <div className="uttarayan-banner uttarayan-banner--right">✨ 🪁 🎯</div>

        <div className="hero__copy">
          <Logo />
          <p className="eyebrow">A Festive Gift for You!</p>
          <h3 className="headline">
            Let your business celebrate with free MakarSankranti
            creatives.
          </h3>
          <p className="body">
            Register now and receive a professionally designed MakarSankranti
            poster/flyer absolutely free. Whether you&apos;re a
            business, brand, or company, this festive gift is for all
            registrants.
          </p>
          <p className="body">
            Don&apos;t miss this chance to start the with fresh,
            festive creatives.
          </p>
        </div>

        <div className="hero__form">
          <div className="kites-decoration">
            <div
              className="festive-card kite-card kite-card--1"
              aria-hidden="true"
            >
              <div className="kite-decoration">🪁</div>
            </div>
            <div
              className="festive-card kite-card kite-card--2"
              aria-hidden="true"
            >
              <div className="kite-decoration">🪁</div>
            </div>
          </div>
          <div className="card">
            {!isSubmitted ? (
              <>
                <h2 className="card__title">Free Registration Form</h2>

                <form className="form" onSubmit={handleSubmit}>
                  <label
                    className={`form__label ${getFieldError("fullName") ? "form__label--error" : ""
                      }`}
                  >
                    <span className="form__label-text">Full Name*</span>
                    <input
                      type="text"
                      name="fullName"
                      value={formValues.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter Full Name"
                      className={
                        getFieldError("fullName") ? "form__input--error" : ""
                      }
                    />
                    {getFieldError("fullName") && (
                      <span className="form__error-message">
                        {getFieldError("fullName")}
                      </span>
                    )}
                  </label>

                  <label
                    className={`form__label ${getFieldError("businessName") ? "form__label--error" : ""
                      }`}
                  >
                    <span className="form__label-text">Business Name</span>
                    <input
                      type="text"
                      name="businessName"
                      value={formValues.businessName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter Business Name"
                      className={
                        getFieldError("businessName")
                          ? "form__input--error"
                          : ""
                      }
                    />
                    {getFieldError("businessName") && (
                      <span className="form__error-message">
                        {getFieldError("businessName")}
                      </span>
                    )}
                  </label>

                  <label
                    className={`form__label ${getFieldError("email") ? "form__label--error" : ""
                      }`}
                  >
                    <span className="form__label-text">Email Address*</span>
                    <input
                      type="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter Email Address"
                      className={
                        getFieldError("email") ? "form__input--error" : ""
                      }
                    />
                    {getFieldError("email") && (
                      <span className="form__error-message">
                        {getFieldError("email")}
                      </span>
                    )}
                  </label>

                  <label
                    className={`form__label ${getFieldError("address") ? "form__label--error" : ""
                      }`}
                  >
                    <span className="form__label-text">Address</span>
                    <input
                      type="text"
                      name="address"
                      value={formValues.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter Address"
                      className={
                        getFieldError("address") ? "form__input--error" : ""
                      }
                    />
                    {getFieldError("address") && (
                      <span className="form__error-message">
                        {getFieldError("address")}
                      </span>
                    )}
                  </label>

                  <label className="form__label">
                    Business Logo (optional)
                    <CloudinaryUploader
                      onUpload={(url) =>
                        setFormValues((prev) => ({
                          ...prev,
                          businessLogo: url,
                        }))
                      }
                      resetKey={resetKey}
                    />
                  </label>

                  <label
                    className={`form__label ${getFieldError("contact") ? "form__label--error" : ""
                      }`}
                  >
                    <span className="form__label-text">Contact No</span>
                    <input
                      type="tel"
                      name="contact"
                      value={formValues.contact}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter Contact No"
                      minLength={10}
                      maxLength={10}
                      className={
                        getFieldError("contact") ? "form__input--error" : ""
                      }
                    />
                    {getFieldError("contact") && (
                      <span className="form__error-message">
                        {getFieldError("contact")}
                      </span>
                    )}
                  </label>
                  <button
                    type="submit"
                    className={`btn ${isSubmitting ? "btn--loading" : ""}`}
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
              </>
            ) : (
              <div className="success-state">
                <h2 className="card__title">🎉 Registration Successful!</h2>
                <div className="success-content">
                  {formValues.businessLogo && (
                    <div className="success-logo-container">
                      <img
                        src={formValues.businessLogo}
                        alt="Your Business Logo"
                        className="success-logo"
                      />
                      <p className="success-logo-text">Your Business Logo</p>
                    </div>
                  )}
                  <p className="success-message">
                    Thank you for registering! We'll Contact you for Christmas &
                    creatives to you
                  </p>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={handleSubmitAnother}
                  >
                    Submit Another Response
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="section">
        <p className="eyebrow center">Free Poster For MakarSankranti</p>
        <div className="floating-kite floating-kite--1">🪁</div>
        <div className="floating-kite floating-kite--2">🪁</div>
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
          <p className="eyebrow">MakarSankranti wish and party</p>
          <div className="floating-banner floating-banner--1">✨</div>
          <p className="body">
            Fill your MakarSankranti holiday with joyful decorations, and
            unforgettable experiences. Join our festive event with your family
            and children, and celebrate the most magical holiday of the year.
            From heartwarming carols to fun activities for all ages, there is
            something special for everyone.
          </p>
          <p className="body strong">
            Register now and receive an exclusive MakarSankranti and
            poster and flyer—absolutely free!
          </p>
        </div>

        <div className="festive-elements">
          <div className="festive-card tree-card" aria-hidden="true">
            <div className="tree-card__tree">
              <img src={imagePaths.mainkite} alt="Decorative kite" />
            </div>
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
        <div className="floating-kite floating-kite--3">🪁</div>
        <div className="floating-banner floating-banner--2">🎯</div>
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
          src={imagePaths.footer}
          className="img-fluid footer-image"
          alt="Festive  MakarSankranti  poster design featuring celebratory decorations and seasonal elements in a joyful, warm atmosphere"
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
          style={{ width: "100%", height: "100%" }}
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
      {image && (
        <SafeImage
          src={image}
          className="poster__image"
          alt={`${theme} poster`}
        />
      )}
    </div>
  );
}

function PageLoader({ isLoading }) {
  return (
    <div className={`page-loader ${!isLoading ? "fade-out" : ""}`}>
      <div className="loader-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loader-text">Loading...</p>
    </div>
  );
}