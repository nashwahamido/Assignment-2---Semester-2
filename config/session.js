module.exports = {
  secret: process.env.SESSION_SECRET || 'atlasphere-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
};
