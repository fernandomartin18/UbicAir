import { useState, useEffect } from 'react';
import '../css/Navbar.css';

function Navbar() {
  const [activeSection, setActiveSection] = useState('vista-general');

  const sections = [
    { id: 'vista-general', name: '📊 Vista General' },
    { id: 'retrasos', name: '⏱️ Retrasos' },
    { id: 'aerolineas', name: '✈️ Aerolíneas' },
    { id: 'rutas', name: '🗺️ Rutas' },
    { id: 'temporal', name: '📅 Temporal' },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset para compensar el navbar fijo
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`navbar-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => scrollToSection(section.id)}
          >
            {section.name}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
