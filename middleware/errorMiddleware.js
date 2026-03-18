const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).render('error', {
    user: req.session ? req.session.user || null : null,
    message: err.message || 'Something went wrong',
    status: status
  });
};

module.exports = errorMiddleware;
