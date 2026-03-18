const express = require('express');
const router = express.Router();


//1: show country selection page//
router.get('/create/country', (req, res) => {
  res.render('groups/create-country', { title: 'Create Country' });
});

//2: show city selection page//
router.get('/create/city', (req, res) => {
  res.render('groups/create-city', { title: 'Create City' });
});

//3: show days selection page//
router.get('/create/days', (req, res) => {
  res.render('groups/create-days', { title: 'Create Days' });
});

//4: show confirmation page//
router.get('/create/confirm', (req, res) => {
  res.render('groups/create-confirm', { title: 'Confirm Group' });
});

module.exports = router;
