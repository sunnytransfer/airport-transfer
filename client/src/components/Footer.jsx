import React from 'react';
import SocialIcons from './SocialIcons';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <h3>Connect with us</h3>
                <br />
                <div style={{ justifyContent: 'center' }} className="social-icons">
                    <SocialIcons />
                </div>
                <p style={{ marginTop: '1rem', opacity: 0.7 }}>&copy; 2024 Private Transfer Service. All rights reserved.</p>
                <a href="/admin" style={{ fontSize: 12, opacity: .4 }}>Admin</a>
            </div>
        </footer>
    );
};

export default Footer;
