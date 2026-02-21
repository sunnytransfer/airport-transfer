import React, { useState } from 'react';
import { Plus, Minus, User, Users, ChevronDown } from 'lucide-react';

const PassengerPicker = ({ value, onChange, onClose }) => {
  const [isOpen, setIsOpen] = useState(true); // Always open as it's rendered inside a container or modal

  // Parse initial value or default
  // Assuming value is a number for totalpassengers or an object?
  // User's previous code used 'passengers' as a number. 
  // But this new component manages discrete state (Adults, Children, Rooms).
  // We need to decide how to sync with the parent.
  // The User Request provided a standalone component. I will adapt it to work with the App.

  // NOTE: The previous app state `passengers` was a number (e.g., 2).
  // This new picker manages { adults, children, rooms }.
  // I should probably map `value` (if number) to `adults` and keep others default, 
  // OR update the parent to expect an object.
  // For now, I will keep internal state and call `onChange` with the TOTAL count (Adults + Children) to maintain compatibility,
  // OR strictly follow the user request which is "Use this code".

  const [passengers, setPassengers] = useState({
    adults: typeof value === 'number' ? value : 2,
    children: 0
  });

  const updateCount = (type, operation) => {
    const newVal = operation === 'add' ? passengers[type] + 1 : Math.max(type === 'adults' ? 1 : 0, passengers[type] - 1);

    const newState = {
      ...passengers,
      [type]: newVal
    };

    setPassengers(newState);

    // Update parent with total passengers (Adults + Children) to keep search logic working
    if (onChange) {
      onChange(newState.adults + newState.children);
    }
  };

  return (
    <div className="passenger-picker-container" style={{ fontFamily: 'sans-serif', width: '100%', maxWidth: '280px' }}>
      <div className="bg-white border-gray-200 rounded-lg shadow-xl z-50 p-4" style={{ background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        {[
          { id: 'adults', label: 'Yetişkinler', sub: '' },
          { id: 'children', label: 'Çocuklar', sub: '0 - 17 yaş' }
        ].map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
            <div>
              <p style={{ fontWeight: 'bold', color: '#333', margin: 0 }}>{item.label}</p>
              {item.sub && <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>{item.sub}</p>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => updateCount(item.id, 'subtract')}
                disabled={item.id === 'adults' ? passengers[item.id] <= 1 : passengers[item.id] <= 0}
                style={{
                  padding: '4px', border: '1px solid #006ce4', color: '#006ce4',
                  borderRadius: '4px', background: 'white', cursor: 'pointer',
                  opacity: (item.id === 'adults' ? passengers[item.id] <= 1 : passengers[item.id] <= 0) ? 0.3 : 1
                }}
              >
                <Minus size={18} />
              </button>
              <span style={{ width: '24px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>{passengers[item.id]}</span>
              <button
                onClick={() => updateCount(item.id, 'add')}
                style={{
                  padding: '4px', border: '1px solid #006ce4', color: '#006ce4',
                  borderRadius: '4px', background: 'white', cursor: 'pointer'
                }}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: '16px', padding: '10px',
            color: '#006ce4', border: '1px solid #006ce4', borderRadius: '4px',
            fontWeight: 'bold', background: 'white', cursor: 'pointer', transition: 'background 0.2s'
          }}
        >
          Tamamlandı
        </button>
      </div>
    </div>
  );
};

export default PassengerPicker;
