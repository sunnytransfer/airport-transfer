const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'info@marmaristrip.com', // Placeholder
        pass: process.env.EMAIL_PASS || 'password' // Placeholder
    }
});

const sendReservationUpdate = (booking, status) => {
    if (status !== 'approved') return;

    const subject = `Booking Confirmation - Reservation #${booking.id}`;

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; }
            .header { background-color: #003580; color: #ffffff; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 20px; background: #ffffff; }
            .booking-details { background-color: #f2f2f2; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #555; }
            .value { font-weight: bold; color: #003580; }
            .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
            .whatsapp-btn { display: inline-block; background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px; }
            .highlight { color: #003580; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Booking Confirmed!</h1>
                <p>Your reservation with MarmarisTrip is now approved.</p>
            </div>
            <div class="content">
                <p>Dear <strong>${booking.customer_name}</strong>,</p>
                <p>We are pleased to confirm your transfer reservation. Our driver will be ready to meet you at the scheduled time.</p>
                
                <div class="booking-details">
                    <div class="detail-row">
                        <span class="label">Reservation ID:</span>
                        <span class="value">#${booking.id}</span>
                    </div>
                     <div class="detail-row">
                        <span class="label">Date & Time:</span>
                        <span class="value">${new Date(booking.pickup_time).toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">From:</span>
                        <span class="value">${booking.pickup_location}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">To:</span>
                        <span class="value">${booking.dropoff_location}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Passengers:</span>
                        <span class="value">${booking.pax || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Flight No:</span>
                        <span class="value">${booking.flight_number || 'N/A'}</span>
                    </div>
                     <div class="detail-row">
                        <span class="label">Total Price:</span>
                        <span class="value">${booking.price || 'Pay on Arrival'}</span>
                    </div>
                </div>

                <h3>Meeting Instructions</h3>
                <p>The driver will be waiting for you at the arrival terminal with a sign bearing your name. If you cannot find the driver, please contact us immediately via WhatsApp.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://wa.me/905545790579" class="whatsapp-btn">
                        Chat Support (+90 554 579 05 79)
                    </a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2026 MarmarisTrip. All rights reserved.</p>
                <p>Marmaris, Turkey</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: '"MarmarisTrip Reservations" <info@marmaristrip.com>',
        to: booking.email,
        subject: subject,
        html: htmlTemplate
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('[Email Service] Error sending confirmation:', error);
        } else {
            console.log('[Email Service] Confirmation sent:', info.response);
        }
    });
};

module.exports = { sendReservationUpdate };
