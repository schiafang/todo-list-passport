const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'users/login'
}))

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

router.post('/register', (req, res) => {
  // 使用解構賦值取出表單內容
  const { name, email, password, confirmPassword } = req.body
  // 檢查使用者是否已經註冊，未註冊則新增使用者資料
  User.findOne({ email }).then(user => {
    if (user) {
      console.log('User already exists.')
      res.render('register', { name, email })
    } else {
      return User.create({ name, email, password })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
})

module.exports = router