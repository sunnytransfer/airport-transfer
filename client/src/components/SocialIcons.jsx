import React from 'react';
import { useSite } from '../context/SiteContext';

const SocialIcons = ({ className, links }) => {
    const { settings } = useSite();

    // Use passed links (for preview) or default from context
    const fb = links?.facebook || settings?.social_facebook || 'https://facebook.com';
    const ig = links?.instagram || settings?.social_instagram || 'https://instagram.com';
    const tt = links?.tiktok || settings?.social_tiktok || 'https://tiktok.com';
    const yt = links?.youtube || settings?.social_youtube || 'https://youtube.com';

    return (
        <div className={`social-icons ${className}`} style={{ display: 'flex', gap: '10px' }}>
            {/* Facebook */}
            <a href={fb} target="_blank" rel="noreferrer" aria-label="Facebook" className="social-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
            </a>

            {/* Instagram */}
            <a href={ig} target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
            </a>

            {/* YouTube */}
            <a href={yt} target="_blank" rel="noreferrer" aria-label="YouTube" className="social-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
            </a>

            {/* TikTok */}
            <a href={tt} target="_blank" rel="noreferrer" aria-label="TikTok" className="social-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
            </a>
        </div>
    );
};

export default SocialIcons;
