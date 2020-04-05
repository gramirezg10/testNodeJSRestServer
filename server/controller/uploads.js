const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/productos')

const fs = require('fs')
const path = require('path')

app.use(fileUpload());

app.put('/upload/:type/:id', function (req, res) {
    let type = req.params.type
    let id = req.params.id
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    // check type
    let validType = ['users', 'products'];
    if (validType.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid type! the valid types are ' + validType.join(', '),
            type
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.file;
    // validar extenciones
    let validExt = ['png', 'jpg', 'gif', 'jpeg', 'pdf'];
    let splitName = file.name.split('.');
    if (splitName.length > 2) {
        return res.json({
            ok: false,
            message: 'el archivo debe contener una sola extención',
            fileName: file.name
        })
    } else if (validExt.indexOf(splitName[splitName.length - 1]) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid extension! las extensiones válidas son ' + validExt.join(', '),
            fileName: file.name
        })
    } else {

    }

    let fileName = id + (new Date().getMilliseconds()) + '.' + splitName[splitName.length - 1]
    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // file uploaded
        if (type == 'users') userPicture(id, res, fileName, type)
        else productPicture(id, res, fileName, type)
    });
})


function userPicture(id, res, fileName, type) {
    Usuario.findById(id, (err, userDB) => {
        if (err) {
            deleteOldImgIfExist(type, fileName)
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            deleteOldImgIfExist(type, fileName)
            return res.status(400).json({
                ok: false,
                err: { message: 'User doesnt exist' }
            });
        }

        deleteOldImgIfExist(type, userDB.img)

        userDB.img = fileName;

        userDB.save((err, userSaved) => {
            res.json({
                ok: true,
                user: userSaved,
                img: fileName
            })
        })
    })
}

function productPicture(id, res, fileName, type) {
    Producto.findById(id, (err, productDB) => {
        if (err) {
            deleteOldImgIfExist(type, fileName)
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            deleteOldImgIfExist(type, fileName)
            return res.status(400).json({
                ok: false,
                err: { message: 'Product doesnt exist' }
            });
        }

        deleteOldImgIfExist(type, productDB.img)

        productDB.img = fileName;

        productDB.save((err, productSaved) => {
            res.json({
                ok: true,
                product: productSaved,
                img: fileName
            })
        })
    })
}

function deleteOldImgIfExist(type, imgName) {
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${imgName}`)
    if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg)
}

module.exports = app