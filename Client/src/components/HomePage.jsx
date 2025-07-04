import React, { useEffect, useRef } from 'react';

const HomePage = () => {
  const driverRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const progress = Math.min(scrollY / maxScroll, 1);
      const movePercent = progress * 50;

      if (driverRef.current) {
        driverRef.current.style.transform = `translateX(${movePercent}vw)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cities = [
    { title: 'Hyderabad', img: '/images/delivery1.jpeg' },
    { title: 'Delhi', img: '/images/delivery2.jpeg' },
    { title: 'Bangalore', img: '/images/delivery3.jpeg' },
    { title: 'Chennai', img: '/images/delivery4.jpeg' },
    { title: 'Kolkata', img: '/images/delivery5.jpeg' },
    { title: 'Ahmedabad', img: '/images/delivery6.jpeg' },
  ];

  const doubledCities = [...cities, ...cities];

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f4f8fb;
          color: #222;
          overflow-x: hidden;
        }

        .homepage-container {
          padding-top: 100px;
        }

        .flex-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-bottom: 60px;
          padding: 0 20px;
        }

        .left-side,
        .right-side {
          flex: 1;
          min-width: 300px;
          text-align: center;
        }

        .home1-img,
        .home2-img {
          width: 100%;
          max-width: 400px;
          height: auto;
          border-radius: 100%;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          object-fit: cover;
        }

        .description-section {
          text-align: left;
          padding: 60px 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .description-section h2 {
          font-size: 2.5rem;
          color: #0d47a1;
          margin-bottom: 20px;
          font-style: italic;
        }

        .description-section p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #444;
          font-style: italic;
        }

        .loop-gallery {
          overflow: hidden;
          padding: 40px 0;
        }

        .scrolling-track {
          display: flex;
          gap: 40px;
          width: max-content;
          animation: scrollLoop 25s linear infinite;
        }

        .extra-description {
          text-align: left;
          margin-left : 100px;
          padding: 40px 20px;
          max-width: 600px;
          // margin: 0 auto;
          animation: fadeUp 1.2s ease-in-out;
        }

        .extra-description h2 {
          font-size: 2.2rem;
          color: #0d47a1;
          margin-bottom: 20px;
          font-style: italic;
        }

        .extra-description p {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.8;
          font-style: italic;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scrollLoop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .card {
          width: 250px;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .card img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          transition: transform 0.3s ease-in-out;
        }

        .card:hover img {
          transform: scale(1.05);
        }

        .card-title {
          padding: 12px;
          font-size: 1rem;
          font-weight: bold;
          color: #0d47a1;
          text-align: center;
        }

        footer {
          width: 100%;
          background: #0d47a1;
          color: #fff;
          padding: 40px 20px;
          text-align: center;
          margin-top: 80px;
        }

        .footer-content h3 {
          color: #90caf9;
          margin-bottom: 10px;
        }

        .footer-content a {
          color: #fce4ec;
          text-decoration: none;
          margin: 0 10px;
        }

        .footer-content a:hover {
          text-decoration: underline;
          color: #bbdefb;
        }

        .back-to-top-wrapper {
          text-align: center;
          margin-top: 40px;
        }

        .back-to-top-wrapper button {
          background-color: #0d47a1;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .back-to-top-wrapper button:hover {
          background-color: #1565c0;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .home1-img,
          .home2-img {
            max-width: 100%;
          }

          .description-section,
          .extra-description {
            text-align: center;
          }
        }
      `}</style>

      <div className="homepage-container">
        {/* Top Section: Image Left - Text Right */}
        <div className="flex-container">
          <div className="left-side">
            <img src="/images/home1.jpeg" alt="Home1" className="home1-img" />
          </div>
          <div className="right-side">
            <div className="description-section">
              <h2>Reliable, Fast & Secure Package Delivery</h2>
              <p>
                At <strong>Quick Delivery</strong>, we redefine how you deliver. Whether you need to ship personal parcels,
                business documents, or heavy cargo, our trusted network ensures every package is picked up and
                delivered with precision. From local drop-offs to international logistics, we prioritize safety,
                tracking, and speed — with a human touch that sets us apart from the rest.
              </p>
            </div>
          </div>
        </div>

        {/* Infinite Scroll Gallery */}
        <div className="loop-gallery">
          <div className="scrolling-track">
            {doubledCities.map((item, index) => (
              <div className="card" key={index}>
                <img src={item.img} alt={item.title} />
                <div className="card-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Text Left - Image Right */}
        <div className="flex-container">
          <div className="left-side">
            <div className="extra-description">
              <h2>Why Choose Quick Delivery?</h2>
              <p>
                Our mission is to make your logistics experience effortless. From real-time tracking to dedicated customer support,
                our services are tailored to meet your unique needs. We connect cities, people, and businesses with speed and reliability.
                Whether it's a personal parcel or enterprise-level logistics, trust Quick Delivery to deliver beyond expectations.
              </p>
            </div>
          </div>
          <div className="right-side">
            <img src="/images/home2.jpeg" alt="Home2" className="home2-img" />
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="back-to-top-wrapper">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            ↑ Back to Top
          </button>
        </div>

        {/* Footer */}
        {/* <footer>
          <div className="footer-content">
            <h3>Quick Delivery</h3>
            <p>Email: quickdeliverylite@gmail.com</p>
            <p>Contact: +91 xxxxxxxxx</p>
            <div>
              <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">Instagram</a>
            </div>
            <p style={{ marginTop: '10px' }}>
              &copy; {new Date().getFullYear()} Quick Delivery. All rights reserved.
            </p>
          </div>
        </footer> */}
      </div>
    </>
  );
};

export default HomePage;
