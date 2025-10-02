import http from 'http';
import { config } from './config/index.js';
import { createApp } from './app.js';
import { connectToDatabase } from './utils/database.js';

const app = createApp();
const server = http.createServer(app);
const PORT = config.port;

async function bootstrap() {
  try {
    await connectToDatabase();
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

bootstrap();

process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('SIGINT received. Shutting down gracefully.');
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM received. Shutting down gracefully.');
  server.close(() => process.exit(0));
});



