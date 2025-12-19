// backend/src/middleware/authMiddleware.js
function ensureAuthenticated(req, res, next) {
  // if session has user move forward
  if (req.session && req.session.user) {
    return next();
  }
      // else send to login
      res.redirect('/login');

}

module.exports = ensureAuthenticated;