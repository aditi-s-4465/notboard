// API Skeleton
const express = require('express');

module.exports = (app) => {
  const router = express.Router();
  app.use('/api', router);
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API skeleton ready' });
  });

  // later:
  // router.post('/collections', ...);
  // router.get('/games', ...);
};
