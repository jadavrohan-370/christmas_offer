import React, { useMemo, useState } from 'react';

const posterCards = [
  {
   
    theme: 'night',
    Image: '🌃' ,
  },
  {
    theme: 'christmas',
    accent: '#a0171e',
  },
];

const services = [
  { label: 'Web - Development', icon: '🎁' },
  { label: 'Flutter - App Development', icon: '🎀' },
  { label: 'Mobile - App Development', icon: '🎄' },
  { label: 'UI - UX Designing', icon: '🎆' },
  { label: 'IT Consultancy & support', icon: '🧑‍💻' },
];

const socials = [
  { name: 'Facebook', href: 'https://facebook.com', icon: '📘' },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' },
  { name: 'Instagram', href: 'https://instagram.com', icon: '📸' },
  { name: 'YouTube', href: 'https://youtube.com', icon: '▶️' },
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

  const canSubmit = useMemo(
    () => formValues.fullName.trim() && formValues.email.trim(),
    [formValues],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setStatus({ type: 'error', message: 'Please add name and email.' });
      return;
    }
    setStatus({
      type: 'success',
      message:
        'Thank you for registering! We will share your free festive poster soon.',
    });
    // Placeholder for real submission API call
    console.info('Form submission', formValues);
  };

  return (
    <div className="page">
      <GradientBackground />
      <header className="hero section">
        <div className="hero__copy">
          <Logo />
          <p className="eyebrow">A Festive Gift for You!</p>
          <h1 className="headline">
            Let your business celebrate with free Christmas &amp; New Year
            creatives.
          </h1>
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
                  name="businessName"
                  value={formValues.businessName}
                  onChange={handleChange}
                  placeholder="ReimVibe Technologies"
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
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </label>
              <label className="form__label">
                Business Logo link (optional)
                <input
                  name="businessLogo"
                  value={formValues.businessLogo}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </label>
              <label className="form__label">
                Contact No
                <input
                  name="contact"
                  value={formValues.contact}
                  onChange={handleChange}
                  placeholder="+91 75730 80196"
                />
              </label>
              <button type="submit" className="btn" disabled={!canSubmit}>
                Submit
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
            <PosterCard key={poster.title} {...poster} />
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
          <div className="tree-card__tree">🎄</div>
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
      <div className="logo__mark">RV</div>
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

