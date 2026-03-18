const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('itinerary/index', { user: req.session.user || null });
});

module.exports = router;
