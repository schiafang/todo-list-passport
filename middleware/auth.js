module.exports = {
  authenticator: (req, res, next) => {
    // req.isAuthenticated()會根據 request 的登入狀態回傳 true or false
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/users/login')
  }
}