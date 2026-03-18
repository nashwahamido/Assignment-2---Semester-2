const express = require('express');
const router = express.Router();

router.get('/create/country', (req, res) => {
  res.render('groups/create-country', { title: 'Create Country' });
});

router.get('/create/city', (req, res) => {
  res.render('groups/create-city', { title: 'Create City' });
});

router.get('/create/days', (req, res) => {
  res.render('groups/create-days', { title: 'Create Days' });
});

router.get('/create/confirm', (req, res) => {
  res.render('groups/create-confirm', { title: 'Confirm Group' });
});

module.exports = router;
