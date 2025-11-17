const { createConsumer } = require('../../shared/kafka/kafkaClient');
const Booking = require('../../shared/models/mongoose/Booking');
const { sendMessage } = require('../../shared/kafka/kafkaClient');

const consumer = createConsumer('booking-service-group');

/**
 * Create booking from Kafka message (async)
 */
const createBookingFromKafka = async (bookingData) => {
  try {
    console.log('Processing booking request:', bookingData);

    const booking = new Booking({
      travelerId: bookingData.travelerId,
      propertyId: bookingData.propertyId,
      ownerId: bookingData.ownerId,
      startDate: new Date(bookingData.startDate),
      endDate: new Date(bookingData.endDate),
      guests: bookingData.guests,
      totalPrice: bookingData.totalPrice,
      status: 'PENDING'
    });

    await booking.save();
    console.log('✓ Booking created:', booking._id);

    // Publish booking created event
    await sendMessage('booking-status-updates', [{
      key: booking._id.toString(),
      value: {
        bookingId: booking._id.toString(),
        travelerId: booking.travelerId,
        ownerId: booking.ownerId,
        propertyId: booking.propertyId,
        status: 'PENDING',
        action: 'BOOKING_CREATED',
        timestamp: new Date().toISOString()
      }
    }]);

    console.log('✓ Booking created event published');
    return booking;
  } catch (error) {
    console.error('✗ Error creating booking from Kafka:', error.message);
    throw error;
  }
};

/**
 * Start consuming booking requests
 */
const startBookingConsumer = async () => {
  try {
    await consumer.connect();
    console.log('✓ Booking consumer connected');

    await consumer.subscribe({ topic: 'booking-requests', fromBeginning: false });
    console.log('✓ Subscribed to booking-requests topic');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const bookingData = JSON.parse(message.value.toString());
          console.log('✓ Received booking request from Kafka');

          await createBookingFromKafka(bookingData);
        } catch (error) {
          console.error('✗ Error processing booking message:', error.message);
          // In production, implement dead letter queue or retry logic
        }
      },
    });

    console.log('✓ Booking consumer started');
  } catch (error) {
    console.error('✗ Error starting booking consumer:', error.message);
    throw error;
  }
};

/**
 * Stop consumer
 */
const stopBookingConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log('✓ Booking consumer stopped');
  } catch (error) {
    console.error('✗ Error stopping consumer:', error.message);
  }
};

module.exports = { startBookingConsumer, stopBookingConsumer };

