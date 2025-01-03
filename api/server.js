const express = require('express');
const cors = require('cors');  // Import cors package
const companyRoutes = require('./routes/companyRoutes');
const appointRoute = require('./routes/appointRoutes');

const Userappoint = require('./routes/usersappoint');

const app = express();

// Define CORS options
const corsOptions = {
  origin: 'https://entnt-assessment.vercel.app', // Allow requests from localhost:3000 (React app)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
};

// Enable CORS for all routes using the above configuration
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests (since Express v4.16)
app.use(express.json());

// Use the routes defined in companyRoutes.js and appointRoutes.js
app.use('/api/', companyRoutes);
app.use('/api/appoint', appointRoute);
app.use('/api/', Userappoint); 

// Start the server on port specified in environment or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
