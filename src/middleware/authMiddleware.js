function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error', 'Please log in to continue.');
  return res.redirect('/login');
}

function isLoggedOut(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  return next();
}

module.exports = { isLoggedIn, isLoggedOut };