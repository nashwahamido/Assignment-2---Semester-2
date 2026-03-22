// Error handling middleware
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).render('error', {
    status: status,
    message: err.message || 'Something went wrong',
    user: req.session ? req.session.user || null : null
  });
};