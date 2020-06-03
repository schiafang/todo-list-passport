const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const usePassport = require('./config/passport') //在 express-session 後載入
const methodOverride = require('method-override')
const routes = require('./routes/index')
const flash = require('connect-flash')

require('./config/mongoose')

const app = express()
const PORT = process.env.PORT || 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//順序：定義Passport > res.locals取用授權狀態 > 進入路由
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  // console.log(req.user)
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.warningMsg = req.flash('warningMsg')
  res.locals.successMsg = req.flash('successMsg')
  next()
})
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})