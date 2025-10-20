import React, { useState, useEffect } from 'react';

const CustomDatePicker = ({ 
  value, 
  onChange, 
  minDate, 
  maxDate, 
  blockedDates = [], 
  label,
  placeholder = "Select date"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const isDateBlocked = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return blockedDates.includes(dateString);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Disable dates before minDate
    if (minDate && date < new Date(minDate)) return true;
    
    // Disable dates after maxDate
    if (maxDate && date > new Date(maxDate)) return true;
    
    // Disable blocked dates
    if (isDateBlocked(date)) return true;
    
    return false;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateClick = (date) => {
    if (!isDateDisabled(date)) {
      setSelectedDate(date);
      onChange(date.toISOString().split('T')[0]);
      setIsOpen(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="position-relative">
      <label className="form-label">{label}</label>
      <input
        type="text"
        className="form-control"
        value={formatDate(selectedDate)}
        placeholder={placeholder}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      />
      
      {isOpen && (
        <div className="position-absolute top-100 start-0 bg-white border rounded shadow-lg p-3" 
             style={{ zIndex: 1000, minWidth: '300px', maxWidth: '350px' }}>
          
          {/* Month Navigation */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button 
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={(e) => {
                e.stopPropagation();
                navigateMonth(-1);
              }}
            >
              ‹
            </button>
            <h6 className="mb-0">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h6>
            <button 
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={(e) => {
                e.stopPropagation();
                navigateMonth(1);
              }}
            >
              ›
            </button>
          </div>
          
          {/* Day Headers */}
          <div className="row mb-2">
            {dayNames.map(day => (
              <div key={day} className="col text-center fw-bold text-muted">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="calendar-grid">
            {getDaysInMonth(currentMonth).map((day, index) => (
              <div key={index} className="calendar-day">
                {day ? (
                  <button
                    type="button"
                    className={`btn btn-sm w-100 ${
                      selectedDate && day.toDateString() === selectedDate.toDateString()
                        ? 'btn-primary'
                        : isDateBlocked(day)
                        ? 'btn-danger'
                        : isDateDisabled(day)
                        ? 'btn-secondary disabled'
                        : 'btn-outline-secondary'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateClick(day);
                    }}
                    disabled={isDateDisabled(day)}
                    style={{ 
                      fontSize: '0.8rem',
                      height: '32px',
                      padding: '0',
                      minWidth: '32px'
                    }}
                  >
                    {day.getDate()}
                  </button>
                ) : (
                  <div style={{ height: '32px' }}></div>
                )}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-3">
            <div className="d-flex justify-content-between small text-muted">
              <span>• Available</span>
              <span className="text-danger">• Booked</span>
              <span className="text-muted">• Unavailable</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ zIndex: 999 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomDatePicker;
