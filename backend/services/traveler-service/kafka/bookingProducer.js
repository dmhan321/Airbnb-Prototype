const { sendMessage } = require('../../shared/kafka/kafkaClient');

/**
 * Publish booking request to Kafka
 * @param {Object} bookingData - Booking details
 */
const publishBookingRequest = async (bookingData) => {
  try {
    await sendMessage('booking-requests', [{
      key: bookingData.travelerId,
      value: {
        travelerId: bookingData.travelerId,
        propertyId: bookingData.propertyId,
        ownerId: bookingData.ownerId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        guests: bookingData.guests,
        totalPrice: bookingData.totalPrice,
        timestamp: new Date().toISOString()
      }
    }]);
    console.log('✓ Booking request published to Kafka');
    return { success: true };
  } catch (error) {
    console.error('✗ Error publishing booking request:', error.message);
    throw error;
  }
};

module.exports = { publishBookingRequest };

