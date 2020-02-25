const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err){
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.user;
        next()
    })
}

module.exports.verifyAdmin = (req, res, next) => {
    let user = req.usuario
    console.log(user.role)
    if(user.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok: false,
            err: {
                message: 'No tiene permisos para realizar esta acción'
            }
        })
    }
}

// module.exports = {
//     verifyAdmin,
//     verifyToken
// }