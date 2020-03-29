const express = require('express')

const { verifyToken, verifyAdmin } = require('../middlewares/authentication')
const app = express()

let Categoria = require('../models/categoria');

// Get all categories
app.get('/category', verifyToken, (req, res) => {
    // Categoria.find((err, categoryDB) => { // i use the next option to use populate function ).populate()
    Categoria.find({})
        .sort('descCategory')
        .populate('user', 'name email')
        .exec((err, categoryDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categoryDB
            })
        })
})

// Get a category
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id
    Categoria.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Not found any category with id ' + id
                }
            })
        }
        res.json({
            ok: true,
            categoryDB
        })
    })
})


// Create a category
app.post('/category', verifyToken, (req, res) => {
    //Return a new category
    let body = req.body
    let category = new Categoria({
        descCategory: body.description,
        user: req.usuario._id
    })

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

// Modify a category
app.put('/category/:id', (req, res) => {
    let _id = req.params.id
    let body = req.body
    let descCategory = {
        descCategory: body.description
    }

    Categoria.findByIdAndUpdate(_id, descCategory, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

// Delete a category
app.delete('/category/:id', [verifyToken, verifyAdmin], (req, res) => {
    let _id = req.params.id

    Categoria.findByIdAndRemove(_id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id doesn´t exist'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Category has been deleted'
        })
    })

})

module.exports = app;