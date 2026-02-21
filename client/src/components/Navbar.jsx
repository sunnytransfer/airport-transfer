import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Menu,
    X,
    User,
    Globe,
    CarTaxiFront,
    Map,
    ChevronDown,
    Mail,
    MessageCircle,
    Info,
    FileText,
    BookOpen,
    Ticket,
    LifeBuoy,
    Phone,
    Star,
    Search
} from 'lucide-react';

const DynamicIcons = {
    CarTaxiFront, Map, Ticket, BookOpen, Globe, LifeBuoy, Info, FileText, User, Phone, Mail, Star, Search
};
import { useCurrency } from '../context/CurrencyContext';
import { useSite } from '../context/SiteContext';
import SocialIcons from './SocialIcons';
import '../index.css';

const Navbar = ({ previewSettings }) => {
    const { currency, setCurrency } = useCurrency();
    const { settings: globalSettings } = useSite();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Merge global settings with preview override
    const settings = previewSettings || globalSettings;
    const headerConfig = settings.header || {};

    const flagMap = {
        'TRY': 'tr',
        'USD': 'us',
        'EUR': 'eu',
        'GBP': 'gb'
    };

    const currencies = ['GBP', 'USD', 'EUR', 'TRY'];
    const currencyRef = useRef(null);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (currencyRef.current && !currencyRef.current.contains(event.target)) {
                setIsCurrencyOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isMenuOpen]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    // Helper for text color contrast (Simplified for Booking.com style)
    // If background is white, use dark blue. Else use white.
    // Default to #003580 (Deep Blue) if no config, so text becomes white
    const isWhiteBg = (headerConfig.backgroundColor || '#003580').toLowerCase() === '#ffffff';
    const navTextColor = isWhiteBg ? '#003580' : 'white';

    const handleLogoClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            const el = document.getElementById('booking-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/#booking');
        }
    };

    // Helper to resolve Icon component from string name
    const getIcon = (iconName, props = {}) => {
        if (!iconName) return null;
        const Icon = DynamicIcons[iconName];
        return Icon ? <Icon {...props} /> : null;
    };

    const rawNavItems = (headerConfig && Array.isArray(headerConfig.navItems))
        ? headerConfig.navItems
        : [];

    // Fallback: If no nav items from config, use hardcoded defaults for mobile menu
    const defaultNavItems = [
        { label: 'Private Airport Transfers', path: '/', icon: 'CarTaxiFront' },
        { label: 'Excursions', path: '/excursions', icon: 'Map' }
    ];

    // Filter to ensure we have valid items, with fallback to defaults
    const navItems = rawNavItems.length > 0 ? rawNavItems.slice(0, 5) : defaultNavItems;

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header
                className={`HeaderBar ${scrolled ? 'scrolled' : ''} ${headerConfig.sticky === false ? 'not-sticky' : ''}`}
                style={{
                    backgroundColor: headerConfig.backgroundColor || '#003580',
                    color: navTextColor,
                    '--nav-text-color': navTextColor,
                    borderBottom: 'none'
                }}
            >
                {/* TWO-ROW LAYOUT */}
                <div className="HeaderContainer">
                    <div className="HeaderTopRow">
                        {/* Hamburger (Mobile Only) - Moved to Left */}
                        <button
                            className="hamburger-btn mobile-only"
                            onClick={toggleMenu}
                            aria-label="Menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Logo (Center on Mobile, Left on Desktop) */}
                        <a href="/" onClick={handleLogoClick} className="navbar-logo">
                            {headerConfig.logoUrl ? (
                                <img src={headerConfig.logoUrl} alt={headerConfig.siteTitle || settings.siteTitle} className="navbar-logo-img" />
                            ) : (
                                <span className="navbar-logo-text">
                                    {headerConfig.siteTitle || settings.siteTitle || 'marmaristrip.com'}
                                </span>
                            )}
                        </a>

                        {/* Right Actions (Currency + Login) */}
                        <div className="navbar-zone-right">
                            {/* Currency Selector */}
                            {headerConfig.showCurrency !== false && (
                                <div className="currency-container" ref={currencyRef}>
                                    <button
                                        className="currency-pill"
                                        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                                        aria-label="Select Currency"
                                        aria-expanded={isCurrencyOpen}
                                    >
                                        <img
                                            src={`https://flagcdn.com/w20/${flagMap[currency] || 'eu'}.png`}
                                            alt="currency"
                                            className="currency-flag"
                                        />
                                        <span className="currency-code">{currency}</span>
                                        <ChevronDown size={14} style={{ opacity: 0.8 }} />
                                    </button>

                                    {isCurrencyOpen && (
                                        <div className="currency-dropdown">
                                            {currencies.map((c) => (
                                                <button
                                                    key={c}
                                                    className={`currency-item ${currency === c ? 'active' : ''}`}
                                                    onClick={() => { setCurrency(c); setIsCurrencyOpen(false); }}
                                                >
                                                    <img src={`https://flagcdn.com/w20/${flagMap[c]}.png`} className="currency-flag-sm" alt={c} />
                                                    <span>{c}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Login Button */}
                            {headerConfig.cta && headerConfig.cta.enabled !== false ? (
                                <Link to={headerConfig.cta.path || '/admin'} className="navbar-login-btn desktop-only">
                                    {getIcon(headerConfig.cta.icon || 'User', { size: 16 })}
                                    <span>{headerConfig.cta.label || 'Log in'}</span>
                                </Link>
                            ) : (
                                <Link to="/admin" className="navbar-login-btn desktop-only">
                                    <User size={16} />
                                    <span>Log in</span>
                                </Link>
                            )}

                            {/* Mobile Search/User Icon Placeholder if needed, but per specs mainly Currency/Sign in. 
                                The Sign In is hidden on mobile in current code (desktop-only class).
                                Rule says: Right: language / currency / sign in.
                                So I should SHOW Sign In on mobile if space permits, or Icon only.
                                Booking.com mobile usually has User icon.
                                I'll add a mobile user icon here.
                            */}
                            <Link to="/admin" className="navbar-mobile-user-btn mobile-only">
                                <User size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* BOTTOM ROW: Navigation Pills (Desktop Only) */}
                    <nav className="HeaderBottomRow">
                        {settings.enableTransfers !== false && (
                            <Link to="/" className={`nav-pill ${isActive('/') ? 'active' : ''}`}>
                                <CarTaxiFront size={18} />
                                <span>Airport Transfers</span>
                            </Link>
                        )}
                        {settings.enableExcursions !== false && (
                            <Link to="/excursions" className={`nav-pill ${isActive('/excursions') ? 'active' : ''}`}>
                                <Map size={18} />
                                <span>Excursions</span>
                            </Link>
                        )}
                        {settings.enableBlog === true && (
                            <Link to="/blog" className={`nav-pill ${isActive('/blog') ? 'active' : ''}`}>
                                <BookOpen size={18} />
                                <span>Blog</span>
                            </Link>
                        )}
                        <a href="/booking" className={`nav-pill ${isActive('/booking') ? 'active' : ''}`}>
                            <span>Book transfer</span>
                        </a>
                    </nav>
                </div>
            </header>

            {/* Mobile/Drawer Menu Overlay */}
            <div className={`navbar-drawer-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>

            {/* Drawer Content */}
            <div className={`navbar-drawer ${isMenuOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <span className="drawer-title">Menu</span>
                    <button className="drawer-close" onClick={closeMenu} aria-label="Close menu">
                        <X size={24} />
                    </button>
                </div>

                <div className="drawer-content">
                    {/* Group 1: Main Navigation */}
                    <div className="drawer-menu-group">
                        <a href="/booking" className="drawer-item" onClick={closeMenu}>
                            <CarTaxiFront size={22} />
                            <span>Book transfer</span>
                        </a>
                        {settings.enableTransfers !== false && (
                            <Link to="/" className="drawer-item" onClick={closeMenu}>
                                <CarTaxiFront size={22} />
                                <span>Airport Transfers</span>
                            </Link>
                        )}
                        {settings.enableExcursions !== false && (
                            <Link to="/excursions" className="drawer-item" onClick={closeMenu}>
                                <Map size={22} />
                                <span>Excursions</span>
                            </Link>
                        )}
                        {settings.enableBlog === true && (
                            <Link to="/blog" className="drawer-item" onClick={closeMenu}>
                                <BookOpen size={22} />
                                <span>Blog</span>
                            </Link>
                        )}
                    </div>

                    <div className="drawer-divider"></div>

                    {/* Group 2: User Actions */}
                    <div className="drawer-menu-group">
                        <Link to={headerConfig.cta?.path || '/admin'} className="drawer-item" onClick={closeMenu}>
                            <User size={22} />
                            <span>Log in</span>
                        </Link>
                        {/* "My bookings" links to admin/dashboard for now as per plan */}
                        <Link to="/admin" className="drawer-item" onClick={closeMenu}>
                            <FileText size={22} />
                            <span>My bookings</span>
                        </Link>
                    </div>

                    <div className="drawer-divider"></div>

                    {/* Group 3: Contact */}
                    <div className="drawer-menu-group">
                        <a href="/#contact" className="drawer-item" onClick={closeMenu}>
                            <Mail size={22} />
                            <span>Contact</span>
                        </a>
                        <a
                            href="https://wa.me/905555555555"
                            target="_blank"
                            rel="noreferrer"
                            className="drawer-item"
                            onClick={closeMenu}
                        >
                            <MessageCircle size={22} />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
