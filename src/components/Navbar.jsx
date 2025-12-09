import { useState, useEffect } from 'react';
import { MdDashboard, MdAccessTime, MdFlight, MdMap, MdCalendarToday, MdHome } from 'react-icons/md';
import '../css/Navbar.css';

function Navbar() {
  const [activeSection, setActiveSection] = useState('inicio');

  const sections = [
    { id: 'inicio', name: 'Inicio', icon: MdHome },
    { id: 'vista-general', name: 'Vista General', icon: MdDashboard },
    { id: 'retrasos', name: 'Retrasos', icon: MdAccessTime },
    { id: 'aerolineas', name: 'Aerolíneas', icon: MdFlight },
    { id: 'rutas', name: 'Rutas', icon: MdMap },
    { id: 'temporal', name: 'Temporal', icon: MdCalendarToday },
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
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              className={`navbar-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => scrollToSection(section.id)}
            >
              <Icon className="navbar-icon" />
              <span>{section.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
