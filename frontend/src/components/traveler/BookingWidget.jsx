import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createBooking, setStatusFilter, fetchBookings } from '../../store/slices/bookingSlice';
import AvailabilityCalendar from './AvailabilityCalendar';
import { formatDateLocal, getDatesInRange } from '../../utils/dateUtils';
import './BookingWidget.css';

const BookingWidget = ({ property, blockedDates = [] }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { loading: bookingLoading } = useAppSelector((state) => state.booking);
  const navigate = useNavigate();
  
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    guests: 1
  });
  const [error, setError] = useState('');
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate nights and total price
  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate && property?.price) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const calculatedNights = diffDays > 0 ? diffDays : 0;
      setNights(calculatedNights);
      setTotalPrice(calculatedNights * property.price);
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [bookingData.startDate, bookingData.endDate, property?.price]);

  const handleDateSelect = (dates) => {
    setBookingData({
      ...bookingData,
      startDate: dates.startDate || '',
      endDate: dates.endDate || ''
    });
    setError('');
  };

  const handleGuestsChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setBookingData({
      ...bookingData,
      guests: Math.max(1, Math.min(value, property?.maxGuests || 10))
    });
  };

  const handleReserve = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (nights === 0) {
      setError('Check-out date must be after check-in date');
      return;
    }

    // Validate that selected dates don't include blocked dates
    // Use UTC date formatting to match backend blocked dates
    const datesInRange = getDatesInRange(bookingData.startDate, bookingData.endDate);
    const blockedDateInRange = datesInRange.find(dateString => blockedDates.includes(dateString));
    
    if (blockedDateInRange) {
      setError(`Selected dates include unavailable dates (${blockedDateInRange}). Please choose different dates.`);
      return;
    }

    setError('');

    try {
      const result = await dispatch(createBooking({
        propertyId: property.id || property._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        guests: bookingData.guests
      }));

      if (result.type === 'booking/createBooking/fulfilled') {
        // Show success message
        alert('Booking successfully created!');
        
        // Re-fetch bookings to ensure the new booking is in the list
        await dispatch(fetchBookings('traveler'));
        
        // Auto-switch to "Pending" filter so user can see their new booking
        dispatch(setStatusFilter('pending'));
        
        // Redirect to trips page
        navigate('/traveler/trips');
      } else {
        // Ensure error is a string, not an object
        const errorMessage = typeof result.payload === 'string' 
          ? result.payload 
          : result.payload?.message || result.payload?.error || 'Failed to create booking';
        
        // Show error message in alert AND in the UI
        alert(`Failed to create booking: ${errorMessage}`);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create booking';
      
      // Show error message in alert AND in the UI
      alert(`Failed to create booking: ${errorMessage}`);
      setError(errorMessage);
    }
  };

  if (!property) return null;

  return (
    <div className="booking-widget">
      <div className="booking-widget-content">
        {/* Price */}
        <div className="booking-price">
          <span className="booking-price-amount">${property.price}</span>
          <span className="booking-price-label">/night</span>
        </div>

        {/* Booking Form */}
        <div className="booking-form">
          {/* Date Picker */}
          <div className="booking-section">
            <label className="booking-label">Dates</label>
            <AvailabilityCalendar
              blockedDates={blockedDates}
              onDateSelect={handleDateSelect}
              selectedStartDate={bookingData.startDate}
              selectedEndDate={bookingData.endDate}
            />
          </div>

          {/* Guest Selector */}
          <div className="booking-section">
            <label className="booking-label">Guests</label>
            <div className="booking-guests">
              <button
                type="button"
                className="booking-guests-btn"
                onClick={() => handleGuestsChange({ target: { value: bookingData.guests - 1 } })}
                disabled={bookingData.guests <= 1}
              >
                −
              </button>
              <input
                type="number"
                className="booking-guests-input"
                value={bookingData.guests}
                onChange={handleGuestsChange}
                min="1"
                max={property.maxGuests || 10}
              />
              <button
                type="button"
                className="booking-guests-btn"
                onClick={() => handleGuestsChange({ target: { value: bookingData.guests + 1 } })}
                disabled={bookingData.guests >= (property.maxGuests || 10)}
              >
                +
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="booking-error">
              {error}
            </div>
          )}

          {/* Reserve Button */}
          <button
            className="booking-reserve-btn"
            onClick={handleReserve}
            disabled={!bookingData.startDate || !bookingData.endDate || nights === 0 || bookingLoading}
          >
            {bookingLoading ? 'Processing...' : 'Reserve'}
          </button>

          {/* Price Breakdown */}
          {nights > 0 && (
            <div className="booking-breakdown">
              <div className="booking-breakdown-row">
                <span>${property.price} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                <span>${nights * property.price}</span>
              </div>
              <div className="booking-breakdown-total">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;

