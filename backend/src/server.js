import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { verifySmtpConfig } from './services/emailService.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & verify services
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`[Backend]: Running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[Backend]: Listening on http://localhost:${PORT}`);
    console.log(`[Backend]: API Base URL: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);

    // Verify SMTP Configuration asynchronously on startup
    verifySmtpConfig().catch(() => { });
  });
});
// Last updated notification services: 2026-08-25T23:40:00
