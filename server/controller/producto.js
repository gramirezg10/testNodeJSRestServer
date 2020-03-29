const express = require('express')

const { verifyToken } = require('../middlewares/authentication')

let app = express()
let Producto = require('../models/productos')

const rest = '/product'

// get all products
app.get(rest, verifyToken, (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)
    Producto.find({disponible: true})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'name email')
        .populate('categoria', 'descCategory')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            res.json({
                ok: true,
                productDB
            });
        })
})

// get a product by id 
app.get(rest + '/:id', verifyToken, (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'name email')
        .populate('categoria', 'descCategory')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
        });
})

//  find product by term
app.get(rest + '/find/:term', verifyToken, (req, res) => {
    let term = req.params.term;
    let regex = new RegExp(term, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descCategory')
        .exec((err, productDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productDB
            })
        })
});

// create a product
app.post('/product', verifyToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.name,
        precioUni: body.price,
        descripcion: body.desc,
        disponible: body.enable,
        categoria: body.category
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
})

// update a product
app.put(rest + '/:id', verifyToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }
        productoDB.nombre = body.name;
        productoDB.precioUni = body.price;
        productoDB.categoria = body.category;
        productoDB.disponible = body.enable;
        productoDB.descripcion = body.desc;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
})

// delete a product
app.delete(rest + '/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {message: 'ID no existe'}
            });
        }
        if(productoDB.disponible){
            productoDB.disponible = false;
            productoDB.save((err, productoBorrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    producto: productoBorrado,
                    mensaje: 'Producto borrado'
                });
            })
        }else{
            res.json({
                ok: true,
                message: 'The product was already disabled'
            })
        }
    })
})



module.exports = app 