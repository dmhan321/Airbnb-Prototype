import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const AvailabilityCalendar = ({ 
  blockedDates = [], 
  onDateSelect, 
  selectedStartDate, 
  selectedEndDate,
  minDate,
  maxDate 
}) => {
  const [selectedDates, setSelectedDates] = useState({
    start: selectedStartDate ? new Date(selectedStartDate) : null,
    end: selectedEndDate ? new Date(selectedEndDate) : null
  });

  // Check if a date is blocked
  const isDateBlocked = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return blockedDates.includes(dateString);
  };

  // Check if a date is disabled
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

  // Custom tile content to show availability status
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const isBlocked = isDateBlocked(date);
      const isDisabled = isDateDisabled(date);
      
      return (
        <div className="calendar-tile-content">
          {isBlocked && <div className="blocked-indicator">●</div>}
          {isDisabled && !isBlocked && <div className="disabled-indicator">●</div>}
        </div>
      );
    }
    return null;
  };

  // Custom tile class names for styling
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const classes = [];
      
      if (isDateBlocked(date)) {
        classes.push('blocked-date');
      } else if (isDateDisabled(date)) {
        classes.push('disabled-date');
      } else {
        classes.push('available-date');
      }
      
      // Highlight selected dates
      if (selectedDates.start && date.toDateString() === selectedDates.start.toDateString()) {
        classes.push('selected-start');
      }
      if (selectedDates.end && date.toDateString() === selectedDates.end.toDateString()) {
        classes.push('selected-end');
      }
      
      // Highlight date range
      if (selectedDates.start && selectedDates.end) {
        const dateTime = date.getTime();
        const startTime = selectedDates.start.getTime();
        const endTime = selectedDates.end.getTime();
        
        if (dateTime > startTime && dateTime < endTime) {
          classes.push('in-range');
        }
      }
      
      return classes.join(' ');
    }
    return '';
  };

  // Handle date selection
  const handleDateChange = (value) => {
    if (Array.isArray(value)) {
      // Date range selection
      setSelectedDates({
        start: value[0],
        end: value[1]
      });
      
      if (value[0] && value[1]) {
        onDateSelect({
          startDate: value[0].toISOString().split('T')[0],
          endDate: value[1].toISOString().split('T')[0]
        });
      }
    } else if (value) {
      // Single date selection
      if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
        // Start new selection
        setSelectedDates({
          start: value,
          end: null
        });
      } else if (selectedDates.start && !selectedDates.end) {
        // Complete selection
        const startDate = selectedDates.start;
        const endDate = value;
        
        if (endDate > startDate) {
          setSelectedDates({
            start: startDate,
            end: endDate
          });
          
          onDateSelect({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
          });
        } else {
          // If end date is before start date, make it the new start date
          setSelectedDates({
            start: endDate,
            end: null
          });
        }
      }
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedDates({ start: null, end: null });
    onDateSelect({ startDate: '', endDate: '' });
  };

  return (
    <div className="availability-calendar">
      <div className="calendar-header mb-3">
        <h6>Select your dates</h6>
        <p className="text-muted small">
          Choose your check-in and check-out dates
        </p>
      </div>
      
      <Calendar
        onChange={handleDateChange}
        value={selectedDates.start && selectedDates.end ? [selectedDates.start, selectedDates.end] : selectedDates.start}
        tileContent={tileContent}
        tileClassName={tileClassName}
        selectRange={true}
        minDate={minDate ? new Date(minDate) : new Date()}
        maxDate={maxDate ? new Date(maxDate) : undefined}
        formatShortWeekday={(locale, date) => {
          return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
        }}
      />
      
      {/* Legend */}
      <div className="calendar-legend mt-3">
        <div className="d-flex justify-content-between small text-muted">
          <span><span className="legend-dot available"></span> Available</span>
          <span><span className="legend-dot blocked"></span> Booked</span>
          <span><span className="legend-dot disabled"></span> Unavailable</span>
        </div>
      </div>
      
      {/* Selected dates display */}
      {(selectedDates.start || selectedDates.end) && (
        <div className="selected-dates mt-3 p-2 bg-light rounded">
          <div className="row">
            <div className="col-6">
              <small>
                <strong>Check-in:</strong><br/>
                {selectedDates.start ? selectedDates.start.toLocaleDateString() : 'Not selected'}
              </small>
            </div>
            <div className="col-6">
              <small>
                <strong>Check-out:</strong><br/>
                {selectedDates.end ? selectedDates.end.toLocaleDateString() : 'Not selected'}
              </small>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-outline-secondary mt-2"
            onClick={clearSelection}
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
