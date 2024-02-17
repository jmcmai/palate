import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faBook, faCalendarAlt, faCog, faRobot, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import Logo from '../images/logo.svg';

library.add(faBars, faTimes, faBook, faCalendarAlt, faCog, faRobot, faUserFriends);

const Navbar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const Greeting = ({ username }) => {
        // Array of random greetings
        const greetings = ["What's Cookin'", "Welcome Back", "Ready, Set, Cook", "Sizzle and Serve", "Preheat and Prepare", "Let's Cook"];
    
        // Generate a random index to pick a greeting
        const randomIndex = Math.floor(Math.random() * greetings.length);
    
        return (
            <div className= {`center greeting-container ${isMobileMenuOpen ? 'greeting-show' : 'greeting-hide'}`}>
                <h3 className="small-margin">{greetings[randomIndex]},</h3>
                <h3 className="small-margin grey-text">@{username}!</h3>
            </div>
        );
    };

    return (
        <nav className="navbar">
            <img className={`logo ${isMobileMenuOpen ? 'menu-open' : 'menu-close'}`} src={Logo} alt="Logo" />
            <Greeting></Greeting>
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
                            <FontAwesomeIcon icon={faRobot} /> chat
                        </Link>
                    </li>
                    <li>
                        <Link to="/events" className={location.pathname === '/events' ? 'active' : ''}>
                        <FontAwesomeIcon icon={faCalendarAlt} /> events
                        </Link>
                    </li>
                    <li>
                        <Link to="/friends" className={location.pathname === '/friends' ? 'active' : ''}>
                        <FontAwesomeIcon icon={faUserFriends} /> friends
                        </Link>
                    </li>
                    <li className="settings">
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
