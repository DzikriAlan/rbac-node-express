require('dotenv').config()
var bcrypt = require('bcryptjs');
var { roles } = require('../utils/roles');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            required: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            required: true
        },
        role: {
            type: DataTypes.ENUM(roles.admin, roles.moderator, roles.client),
            defaultValue: roles.client
        }
    }, {
        tableName: 'users'
    });

    User.prototype.isValidPassword = async(password) => {
        // MEREFERENSI KE VALUE DARI VARIABLE USER
        const user = this; 
        const compare = await bcrypt.compare(password, user.password)
        return compare;
    }
    
    User.beforeCreate(async(user, options) => {
        // MENGGENERATE SALT MENGGUNAKAN GENSALT 10
        const salt = await bcrypt.genSalt(10);
        // MENG HASH USER.PASSWORD MENGGUNAKAN SALT YANG SUDAH DI GENERATE
        const hashedPassword = await bcrypt.hash(user.password, salt)
        // MENYIMPAN HASIL HASHING KE USER.PASSWORD
        user.password = hashedPassword;
        // JIKA USER.EMAIL NYA admin@gmail.com MAKA ROLE DI UBAH MENJADI ADMIN
        if(user.email === process.env.ADMIN_EMAIL){
            user.role = roles.admin;
        }
    });

    return User;
}