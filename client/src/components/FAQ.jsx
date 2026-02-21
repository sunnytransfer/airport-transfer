import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "How do I book a transfer?",
            answer: "Booking is easy! Simply enter your pickup and drop-off locations, choose your date and time, and select your vehicle. Enter your details, and you'll receive an instant confirmation via email and WhatsApp."
        },
        {
            question: "What is the cancellation policy?",
            answer: "We offer free cancellation up to 24 hours before your scheduled pickup time. You can cancel directly through your confirmation email or by contacting our 24/7 support team."
        },
        {
            question: "How do I make a payment?",
            answer: "You can pay securely online using any major credit card or debit card. We also offer the option to pay in cash directly to the driver upon arrival for select routes."
        },
        {
            question: "Will the driver wait if my flight is delayed?",
            answer: "Yes, we monitor arrival flights. If your flight is delayed, our driver will adjust the pickup time accordingly at no extra cost to ensure they are there when you land."
        },
        {
            question: "Are there any hidden fees?",
            answer: "No, our prices are all-inclusive. The price you see is the price you pay, including taxes, tolls, and gratuity."
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section" style={{ background: '#f5f5f5', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#262626', marginBottom: '0.5rem' }}>
                        Frequently Asked Questions
                    </h2>
                    <p style={{ color: '#666' }}>Everything you need to know about your transfer.</p>
                </div>

                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    {faqs.map((faq, index) => (
                        <div key={index} style={{ borderBottom: index === faqs.length - 1 ? 'none' : '1px solid #eee' }}>
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={(e) => { e.preventDefault(); toggleAccordion(index); }}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAccordion(index); } }}
                                style={{
                                    width: '100%',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#262626',
                                    transition: 'background 0.2s',
                                    outline: 'none' // Prevent outline jump if that was it
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <HelpCircle size={18} color="var(--primary-blue)" />
                                    {faq.question}
                                </span>
                                {activeIndex === index ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                            </div>

                            {activeIndex === index && (
                                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: '#555', lineHeight: '1.6', fontSize: '0.95rem', paddingLeft: '3.5rem' }}>
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
