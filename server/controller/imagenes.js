const express = require('express')
const fs = require('fs')
let path = require('path')

let app = express()

app.get('/imagenes/:type/:img', (req, res) => {
    let type = req.params.type
    let img = req.params.img
    let imgPath = path.resolve(__dirname, `../../uploads/${type}/${img}`)
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath)
    }else{
        let noImgPath = path.resolve(__dirname, `../assets/vstromYellow.png`)
        res.sendFile(noImgPath)
    }
})

module.exports = app