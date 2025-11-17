const { createConsumer } = require('../../shared/kafka/kafkaClient');

const consumer = createConsumer('owner-notification-group');

/**
 * Start consuming booking status updates for owners
 */
const startStatusConsumer = async () => {
  try {
    await consumer.connect();
    console.log('✓ Status consumer connected (Owner Service)');

    await consumer.subscribe({ topic: 'booking-status-updates', fromBeginning: false });
    console.log('✓ Subscribed to booking-status-updates topic');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const statusUpdate = JSON.parse(message.value.toString());
          console.log('✓ Received status update:', statusUpdate.action);

          // Notify owner about new bookings or status changes
          console.log(`📧 Notify owner ${statusUpdate.ownerId} about booking ${statusUpdate.bookingId} - ${statusUpdate.action}`);
        } catch (error) {
          console.error('✗ Error processing status update:', error.message);
        }
      },
    });

    console.log('✓ Status consumer started (Owner Service)');
  } catch (error) {
    console.error('✗ Error starting status consumer:', error.message);
    throw error;
  }
};

module.exports = { startStatusConsumer };

