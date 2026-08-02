const express = require('express');

const router = express.Router();

// The deployment pipeline polls this route to decide whether a *new* container
// is serving traffic: uptimeSeconds comes from the process itself, so a value
// younger than the deploy trigger proves the replacement is live rather than
// the previous version still answering.
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

module.exports = router;
