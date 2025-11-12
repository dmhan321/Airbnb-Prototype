const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'Traveler Service', port: 5001, dir: 'traveler-service' },
  { name: 'Owner Service', port: 5002, dir: 'owner-service' },
  { name: 'Property Service', port: 5003, dir: 'property-service' },
  { name: 'Booking Service', port: 5004, dir: 'booking-service' }
];

console.log('🚀 Starting all microservices...\n');

const processes = services.map(service => {
  const servicePath = path.join(__dirname, 'services', service.dir);
  
  console.log(`Starting ${service.name} on port ${service.port}...`);
  
  const proc = spawn('npm', ['run', 'dev'], {
    cwd: servicePath,
    shell: true,
    stdio: 'inherit'
  });

  proc.on('error', (error) => {
    console.error(`❌ Error starting ${service.name}:`, error.message);
    console.log(`   Make sure you've run 'npm install' in ${service.dir}`);
  });

  return { name: service.name, process: proc };
});

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping all services...');
  processes.forEach(({ process }) => {
    process.kill();
  });
  process.exit();
});

console.log('\n✅ All services started! Press Ctrl+C to stop all services.\n');

