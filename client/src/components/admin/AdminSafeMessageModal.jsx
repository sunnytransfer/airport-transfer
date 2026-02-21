import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Mail } from 'lucide-react';

const AdminSafeMessageModal = ({ isOpen, onClose, booking, type, settings }) => {
    const [previewText, setPreviewText] = useState('');

    useEffect(() => {
        if (isOpen && booking) {
            generateMessage();
        }
    }, [isOpen, booking, type]);

    const generateMessage = () => {
        // Whitelist fields ONLY for Customer
        const customerSafeData = {
            id: booking.id,
            name: booking.customer_name || 'Guest',
            route: `${booking.pickup_location} -> ${booking.dropoff_location}`,
            date: new Date(booking.pickup_time).toLocaleString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }),
            pax: booking.passenger_count,
            childSeats: booking.baby_seats || 0,
            hotel: booking.hotel_name || 'Not specified',
            flight: booking.flight_number || '-',
            payableTotal: booking.price,
            businessWhatsapp: settings?.whatsapp || '+90 555 123 4567',
            businessEmail: settings?.email || 'info@marmaristrip.com'
        };

        // Driver Message can have more info
        const driverData = {
            ...customerSafeData,
            phone: booking.phone,
            note: booking.note || '-',
            // Add internal fields if available in booking object
        };

        let message = '';

        if (type === 'whatsapp_customer') {
            // STRICT WHITELIST: bookingId, customerName, route, date/time, passengers, childSeats, hotelName, flightNo, payableTotal, businessContact
            message = `Merhaba ${customerSafeData.name},\n\nTransfer rezervasyonunuz onaylanmıştır. ✅\n\nRezervasyon No: #${customerSafeData.id}\n📅 Tarih/Saat: ${customerSafeData.date}\n🚗 Güzergah: ${customerSafeData.route}\n👥 Yolcu: ${customerSafeData.pax}\n👶 Çocuk Koltuğu: ${customerSafeData.childSeats}\n🏨 Otel/Adres: ${customerSafeData.hotel}\n✈️ Uçuş No: ${customerSafeData.flight}\n\n💰 Ödenecek Tutar: £${customerSafeData.payableTotal} (Nakit/Varışta)\n\nSorularınız için bizimle iletişime geçebilirsiniz:\nWhatsApp: ${customerSafeData.businessWhatsapp}\nEmail: ${customerSafeData.businessEmail}\n\nİyi yolculuklar dileriz!`;
        } else if (type === 'whatsapp_driver') {
            // Internal / Driver Message
            message = `🛑 *YENİ GÖREV / DRIVER JOB* 🛑\n\nID: #${driverData.id}\nTarih: ${driverData.date}\n\nGüzergah: ${driverData.route}\nOtel: ${driverData.hotel}\nUçuş: ${driverData.flight}\n\nYolcu: ${driverData.name}\nKişi Sayısı: ${driverData.pax}\nÇocuk Koltuğu: ${driverData.childSeats}\n📞 Tel: ${driverData.phone}\n\n📝 Müşteri Notu: ${driverData.note}\n\nLütfen onaylayın.`;
        } else if (type === 'email_customer') {
            // STRICT WHITELIST
            message = `Subject: Booking Confirmation #${customerSafeData.id}\n\nDear ${customerSafeData.name},\n\nYour transfer booking has been confirmed. ✅\n\nBooking ID: #${customerSafeData.id}\nDate & Time: ${customerSafeData.date}\nRoute: ${customerSafeData.route}\nPassengers: ${customerSafeData.pax}\nChild Seats: ${customerSafeData.childSeats}\nHotel/Address: ${customerSafeData.hotel}\nFlight Number: ${customerSafeData.flight}\n\nTotal Payable: £${customerSafeData.payableTotal} (Pay on Arrival)\n\nIf you have any questions, please contact us:\nWhatsApp: ${customerSafeData.businessWhatsapp}\nEmail: ${customerSafeData.businessEmail}\n\nBest regards,\nMarmarisTrip Team`;
        }

        setPreviewText(message);
    };

    const handleSend = () => {
        const encodedMessage = encodeURIComponent(previewText);

        if (type === 'whatsapp_customer') {
            // Sanitize phone
            let phone = booking.phone.replace(/[^0-9]/g, '');
            window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
        } else if (type === 'whatsapp_driver') {
            // Open WhatsApp to select contact (Driver)
            window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
        } else if (type === 'email_customer') {
            const subject = `Booking Confirmation #${booking.id}`;
            // Extract body from previewText (remove Subject line)
            const body = encodeURIComponent(previewText.replace(/^Subject:.*\n+/, ''));
            window.open(`mailto:${booking.email}?subject=${encodeURIComponent(subject)}&body=${body}`, '_blank');
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000
        }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {type.includes('whatsapp') ? <MessageCircle size={20} color="#25D366" /> : <Mail size={20} color="#007bff" />}
                        {type === 'whatsapp_driver' ? 'Driver Message Preview' : 'Customer Message Preview'}
                    </h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', fontSize: '0.9rem', whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd' }}>
                    {previewText}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleSend} style={{ padding: '8px 24px', borderRadius: '4px', border: 'none', background: type.includes('whatsapp') ? '#25D366' : '#007bff', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                        Send Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSafeMessageModal;
