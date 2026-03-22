const express = require('express');
const router = express.Router();

// List all groups
router.get('/', (req, res) => {
  // TODO: fetch from DB
  const groups = [
    { id: 1, name: 'Prague' },
    { id: 2, name: 'Rome' },
    { id: 3, name: 'Dublin' }
  ];
  res.render('groups/groupPage', {
    user: req.session.user || null,
    group: null,
    groups: groups
  });
});

// Individual group page
router.get('/:id', (req, res) => {
  const groupId = req.params.id;
  // TODO: fetch from DB
  const groups = [
    { id: 1, name: 'Prague' },
    { id: 2, name: 'Rome' },
    { id: 3, name: 'Dublin' }
  ];
  const group = groups.find(g => g.id == groupId) || { id: groupId, name: 'Group ' + groupId, destination: '' };

  res.render('groups/groupPage', {
    user: req.session.user || null,
    group: group,
    groups: groups
  });
});

// Group creation flow
router.get('/create/country', (req, res) => {
  res.render('groups/create-country', { title: 'Choose Destination', user: req.session.user || null });
});

router.get('/create/city', (req, res) => {
  res.render('groups/create-city', { title: 'Choose Cities', user: req.session.user || null });
});

router.get('/create/days', (req, res) => {
  res.render('groups/create-days', { title: 'Trip Length', user: req.session.user || null });
});

router.get('/create/confirm', (req, res) => {
  res.render('groups/create-confirm', { title: 'Group Created', user: req.session.user || null });
});

module.exports = router;