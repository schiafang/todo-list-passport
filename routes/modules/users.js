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

// router.post('/login', passport.authenticate('local',
//   { failureRedirect: 'users/login', failureFlash: true }),
//   (req, res) => {
//     res.redirect('/')
//   })

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'users/login',
  failureFlash: true,
}))

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  // 檢查表單是否填寫正確
  const errors = []
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼必須相同。' })
  }
  // 只要 error 有內容就代表有錯誤，render錯誤訊息
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password
    })
  }
  // 檢查使用者是否已經註冊，未註冊則新增使用者資料
  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '使用者已經存在。' })
      res.render('register', { name, email, errors })
    } else {
      return User.create({ name, email, password })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
})

module.exports = router