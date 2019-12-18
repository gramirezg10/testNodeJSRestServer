require('./config/config')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./controller/usuario'))
// mongoose.connect('mongodb://localhost:27017/cafe', {
mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, (err, res) => {
  if (err) throw err
  console.log('DB Running')
});

app.listen(process.env.PORT, () => {
    console.log(`Listening in the port ${process.env.PORT}`)
})