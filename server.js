const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session configuration
const sessionConfig = require('./config/session');
app.use(session(sessionConfig));

// ── Routes ────────────────────────────────────────

// Homepage
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user || null });
});

// Auth routes
app.get('/auth/login', (req, res) => {
  res.render('login', { title: 'Sign In', user: null });
});

app.post('/auth/login', (req, res) => {
  // TODO: real login logic
  req.session.user = {
    id: 1,
    name: 'TestUser',
    username: 'TestUser',
    email: req.body.email,
    profile_image: null,
    avatar: null,
    countries_visited: 5,
    cities_visited: 12,
    groups_created: 3
  };
  res.redirect('/');
});

app.get('/auth/register', (req, res) => {
  res.render('register', { title: 'Register', user: null });
});

app.post('/auth/register', (req, res) => {
  // TODO: real register logic
  res.redirect('/auth/verify');
});

app.get('/auth/verify', (req, res) => {
  res.render('register-step2', { title: 'Verify', user: null });
});

app.post('/auth/verify', (req, res) => {
  // TODO: real verification logic
  res.redirect('/setup');
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Profile setup flow
app.get('/setup', (req, res) => {
  res.render('setup', { title: 'Profile Setup', user: req.session.user || null });
});

app.get('/setup/countries', (req, res) => {
  res.render('groups/profile/countries', { title: 'Countries Visited', user: req.session.user || null });
});

app.get('/setup/cities', (req, res) => {
  res.render('groups/profile/cities', { title: 'Cities Visited', user: req.session.user || null });
});

// Profile
app.get('/profile', (req, res) => {
  const user = req.session.user || {
    name: 'TestUser',
    username: 'TestUser',
    profile_image: null,
    avatar: null,
    countries_visited: 5,
    cities_visited: 12,
    groups_created: 3
  };
  res.render('profile', { user: user });
});

app.get('/profile/confirmed', (req, res) => {
  res.render('profile/confirmed', { user: req.session.user || null });
});

// Settings
app.get('/settings', (req, res) => {
  res.render('settings', { user: req.session.user || null });
});

// Group routes
app.use('/groups', require('./routes/groups'));

// Error handling - 404
app.use((req, res) => {
  res.status(404).render('error', {
    status: 404,
    message: 'Page not found',
    user: req.session.user || null
  });
});

// Error handling - 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    status: 500,
    message: 'Something went wrong',
    user: req.session.user || null
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;