const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

// 直接匯出 function
module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered!' })
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Email or Password incorrect.' })
        }
        return done(null, user)
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
  })
}
// 反序列化錯誤處理中：Passport 看到第一個參數有 err 就不會處理後面的參數了
// 多放一個 null 用來在語義上明確表達 user 是空的