const dotenv = require('dotenv');
// Load environment variables early
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Phase 2 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
