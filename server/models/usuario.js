const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let validRoles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '`{VALUE}` isnt valid role'
}

let Schema = mongoose.Schema

let schemeUser = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: [true, 'role is required'],
        default: 'USER_ROLE',
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

schemeUser.methods.toJSON = function (){
    let user = this
    let userObject = user.toObject()
    delete userObject.password
    return userObject
}

schemeUser.plugin(uniqueValidator, {message: '{PATH} must be unique'})

module.exports = mongoose.model('User', schemeUser)