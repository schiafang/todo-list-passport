const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

// 直接匯出 function
module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        // 先判斷是否存在帳號
        if (!user) {
          return done(null, false, { failureFlash: 'That email is not registered!' })
        }
        // 使用bcrypt判斷密碼
        return bcrypt.compare(password, user.password).then(isMatch => {
          //if (user.password !== password) {}
          if (!isMatch) {
            return done(null, false, { failureFlash: 'Email or Password incorrect.' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
    // 反序列化錯誤處理中：Passport 看到第一個參數有 err 就不會處理後面的參數了，多放一個 null 表示 user 是空的
  })
}
