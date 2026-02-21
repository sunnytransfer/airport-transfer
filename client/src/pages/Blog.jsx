import React, { useEffect } from 'react';

import Footer from '../components/Footer';

const blogPosts = [
    {
        id: 1,
        title: "Top 10 Things to Do in Marmaris",
        excerpt: "From ancient castles to crystal clear waters, explore the best attractions Marmaris has to offer.",
        date: "Feb 3, 2026",
        img: "https://images.unsplash.com/photo-1596317770857-c3359d9c8c9a?auto=format&fit=crop&w=600&q=80",
        author: "Travel Team"
    },
    {
        id: 2,
        title: "Dalaman Airport Transfer Guide",
        excerpt: "Everything you need to know about getting from the airport to your hotel safely and cheaply.",
        date: "Jan 28, 2026",
        img: "https://images.unsplash.com/photo-1544551763-86a003c2759e?auto=format&fit=crop&w=600&q=80", // Using Boat image for vibe
        author: "Admin"
    },
    {
        id: 3,
        title: "Best Beaches in the Region",
        excerpt: "Discover the most beautiful beaches in Icmeler, Turunc and Amos Bay.",
        date: "Jan 15, 2026",
        img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
        author: "Sarah J."
    },
    {
        id: 4,
        title: "Turkish Cuisine: What to Eat?",
        excerpt: "Don't leave Turkey without trying these delicious local dishes and sweets.",
        date: "Jan 10, 2026",
        img: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80",
        author: "Foodie Guide"
    },
    {
        id: 5,
        title: "Dalyan History & Mud Baths",
        excerpt: "A day trip to Dalyan offers history, nature, and unique spa experiences.",
        date: "Dec 05, 2025",
        img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80",
        author: "History Buff"
    },
    {
        id: 6,
        title: "Shopping in Marmaris Grand Bazaar",
        excerpt: "How to negotiate like a local and find the best souvenirs in the markets.",
        date: "Nov 20, 2025",
        img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
        author: "Shopper 101"
    }
];

const Blog = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            {/* Navbar removed - provided by PublicLayout */}

            {/* Hero Section */}
            <div className="hero">
                <div className="container">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>Marmaris Travel Guide</h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Inspiration, tips, and news for your next holiday.</p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {blogPosts.map(post => (
                        <article key={post.id} style={{
                            background: 'white',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <img
                                src={post.img}
                                alt={post.title}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: '#888',
                                    marginBottom: '0.5rem',
                                    fontWeight: 500,
                                    textTransform: 'uppercase'
                                }}>
                                    {post.date} &bull; {post.author}
                                </div>
                                <h2 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    marginBottom: '0.75rem',
                                    color: '#003580',
                                    lineHeight: 1.3
                                }}>
                                    {post.title}
                                </h2>
                                <p style={{
                                    color: '#555',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6,
                                    marginBottom: '1.5rem',
                                    flex: 1
                                }}>
                                    {post.excerpt}
                                </p>
                                <button style={{
                                    background: 'transparent',
                                    border: '1px solid #003580',
                                    color: '#003580',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    alignSelf: 'flex-start',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => {
                                        e.target.style.background = '#003580';
                                        e.target.style.color = 'white';
                                    }}
                                    onMouseLeave={e => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#003580';
                                    }}
                                >
                                    Read Article
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Footer removed - provided by PublicLayout */}
        </>
    );
};

export default Blog;
