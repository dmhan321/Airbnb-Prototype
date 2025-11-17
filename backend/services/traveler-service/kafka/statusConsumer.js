const { createConsumer } = require('../../shared/kafka/kafkaClient');

const consumer = createConsumer('traveler-notification-group');

/**
 * Start consuming booking status updates
 */
const startStatusConsumer = async () => {
  try {
    await consumer.connect();
    console.log('✓ Status consumer connected (Traveler Service)');

    await consumer.subscribe({ topic: 'booking-status-updates', fromBeginning: false });
    console.log('✓ Subscribed to booking-status-updates topic');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const statusUpdate = JSON.parse(message.value.toString());
          console.log('✓ Received status update:', statusUpdate.action);

          // Here you would send notification to traveler
          // Could be WebSocket, email, or push notification
          console.log(`📧 Notify traveler ${statusUpdate.travelerId} about booking ${statusUpdate.bookingId} - ${statusUpdate.action}`);
        } catch (error) {
          console.error('✗ Error processing status update:', error.message);
        }
      },
    });

    console.log('✓ Status consumer started (Traveler Service)');
  } catch (error) {
    console.error('✗ Error starting status consumer:', error.message);
    throw error;
  }
};

module.exports = { startStatusConsumer };

