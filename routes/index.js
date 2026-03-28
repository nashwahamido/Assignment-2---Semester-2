router.get('/settings', (req, res) => {
  res.render('settings', { user: req.session.user || null });
});