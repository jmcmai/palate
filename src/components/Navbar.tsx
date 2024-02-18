import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faBook, faCalendarAlt, faCog, faRobot, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0 hook
import Logo from '../images/logo.svg';

library.add(faBars, faTimes, faBook, faCalendarAlt, faCog, faRobot, faUserFriends);

const Navbar: React.FC = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated } = useAuth0(); // Destructure user and isAuthenticated from useAuth0

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <img className={`logo ${isMobileMenuOpen ? 'menu-open' : 'menu-close'}`} src={Logo} alt="Logo" />
            <div className={`center greeting-container ${isMobileMenuOpen ? 'greeting-show' : 'greeting-hide'}`}>
                <h3 className="small-margin">What's Cookin',</h3>
                {isAuthenticated && user && <h3 className="small-margin grey-text">{user.name}?</h3>}
            </div>
            <div className="nav-bar">
                <div className={`mobile-menu-icon ${isMobileMenuOpen ? 'white-icon' : 'black-icon'}`} onClick={toggleMobileMenu}>
                    <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
                </div>
                <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
                    <li>
                        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faBook} /> recipes
                        </Link>
                    </li>
                    <li>
                        <Link to="/chat" className={location.pathname === '/chat' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faRobot} /> ramsey
                        </Link>
                    </li>
                    <li>
                        <Link to="/events" className={location.pathname === '/events' ? 'active' : ''}>
                        <FontAwesomeIcon icon={faCalendarAlt} /> events
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
                        <FontAwesomeIcon icon={faCog} /> settings
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
