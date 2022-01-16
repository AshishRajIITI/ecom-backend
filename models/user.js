import mongoose from 'mongoose';
const { createHmac } = await import('crypto');
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trime: true,
        maxlength: 32,
    },

    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
}, { timestamps: true });

userSchema.virtual("password")
    .get(function () {
        return this._password;
    })
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4();
        this.encry_password = this.securePassword(password);
    })

userSchema.methods = {
    authenticate: function (plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password;
    },
    securePassword: function (plainPassword) {
        if (!plainPassword) return "";
        try {
            return createHmac('sha256', this.salt)
                .update(plainPassword)
                .digest('hex');
        }
        catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema);

