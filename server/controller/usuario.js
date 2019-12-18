const express = require('express')
const bcrypt = require('bcrypt');
const _ = require('underscore')

const app = express()
const Usuario = require('../models/usuario')

app.get('/usuario', function (req, res) {
  Usuario.find({status: true})
  .skip(1)
  .limit(20)
  .exec((err, usuarios) => {
    if (err){
      return res.status(400).json({
        ok: false,
        err
      })
    }
    Usuario.countDocuments({status: true}, (err, count) => {
      res.json({
        ok: true,
        usuarios,
        count
      })
    })
  })
})
  
app.post('/usuario', function (req, res) {
  let body = req.body
  let user = new Usuario({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password,10),
    role: body.role
  })

  user.save((err, userDB) => {
    if (err){
      return res.status(400).json({
        ok: false,
        err
      })
    }
    
    res.json({
      ok: true,
      user: userDB
    })
  })
  
})

app.put('/usuario/:id', function (req, res) {
  let id = req.params.id
  let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status'])
  Usuario.findByIdAndUpdate(id, body, {new: true}, (err, userDB) => {
    if (err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      user: userDB
    })
  })
  
  
})

app.delete('/usuario/:id', function (req, res) {
  let id = req.params.id
  newStatus = {status: false}
  Usuario.findByIdAndUpdate(id, newStatus, {new: true}, (err, userDeleted) =>{
    if (err){
      return res.status(400).json({
        ok: false,
        err
      })
    }
    if(!userDeleted){
      return res.status(400).json({
        ok: false,
        err : {
          message: 'User not found'
        }
      })
    }
    res.json({
      ok: true,
      user: userDeleted
    })
  })
})

module.exports = app