const { Kafka } = require('kafkajs');

// Kafka configuration
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'airbnb-app',
  brokers: [process.env.KAFKA_BROKER || 'kafka.kafka.svc.cluster.local:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

// Create producer
const producer = kafka.producer({
  allowAutoTopicCreation: false,
  transactionTimeout: 30000
});

// Create consumer
const createConsumer = (groupId) => {
  return kafka.consumer({
    groupId,
    sessionTimeout: 30000,
    heartbeatInterval: 3000
  });
};

// Connect producer
const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('✓ Kafka producer connected');
  } catch (error) {
    console.error('✗ Error connecting Kafka producer:', error.message);
    throw error;
  }
};

// Send message
const sendMessage = async (topic, messages) => {
  try {
    await producer.send({
      topic,
      messages: messages.map(msg => ({
        key: msg.key || null,
        value: JSON.stringify(msg.value),
        headers: msg.headers || {}
      }))
    });
    console.log(`✓ Message sent to topic: ${topic}`);
  } catch (error) {
    console.error(`✗ Error sending message to ${topic}:`, error.message);
    throw error;
  }
};

// Disconnect producer
const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    console.log('✓ Kafka producer disconnected');
  } catch (error) {
    console.error('✗ Error disconnecting producer:', error.message);
  }
};

module.exports = {
  kafka,
  producer,
  createConsumer,
  connectProducer,
  sendMessage,
  disconnectProducer
};

