const authController = {

  getLogin: (req, res) => {
    res.render('auth/login', { user: null, error: null });
  },

  postLogin: (req, res) => {
    // TODO: add real login logic with DB + bcrypt
    res.redirect('/');
  },

  getRegister: (req, res) => {
    res.render('auth/register', { user: null, error: null });
  },

  postRegister: (req, res) => {
    // TODO: add real register logic with DB + bcrypt
    res.redirect('/auth/login');
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
  }

};

module.exports = authController;
