const express = require('express');
const NodeCache = require('node-cache');
const winston = require('winston');
const { getUserFromDB, updateUserInDB } = require('./db');

// Initialize Express app
const app = express();

// Initialize node-cache with some configurations
const myCache = new NodeCache({ stdTTL: 60, checkperiod: 120 }); // Default TTL 60 seconds, cleanup period 120 seconds

// Configure logging using winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()]
});

// Middleware for caching API responses
const cacheMiddleware = (req, res, next) => {
  const key = `${req.method}:${req.originalUrl}`;
  
  // Try to get the cached value
  const cachedData = myCache.get(key);
  if (cachedData) {
    logger.info(`Cache hit for key: ${key}`);
    return res.json(cachedData); // Send cached response
  }

  // Proceed to the next middleware/handler
  res.sendResponse = res.json;
  res.json = (data) => {
    // Cache the data before sending the response
    myCache.set(key, data);
    res.sendResponse(data);
  };

  next();
};

// Route to get user data from the database with caching
app.get('/user/:id', cacheMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Fetch user from the database (simulated here)
    const user = await getUserFromDB(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user); // Data will be cached here
  } catch (error) {
    logger.error(`Error fetching user data: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update user data and invalidate cache
app.put('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    // Update user data in the database (simulated here)
    const updatedUser = await updateUserInDB(userId, userData);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Invalidate cache after update
    const cacheKey = `GET:/user/${userId}`;
    myCache.del(cacheKey);
    logger.info(`Cache invalidated for key: ${cacheKey}`);

    res.json(updatedUser);
  } catch (error) {
    logger.error(`Error updating user data: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
