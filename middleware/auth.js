module.exports = {
  authenticator: (req, res, next) => {
    // req.isAuthenticated()會根據 request 的登入狀態回傳 true or false
    if (req.isAuthenticated()) {
      return next()
    }
    //未登入狀態沒有被授權時，再次發出 req 則跳出警告訊息
    // req.flash('warningMsg', '請先登入才能使用！')
    res.redirect('/users/login')
  }
}