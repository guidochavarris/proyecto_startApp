const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"please enter you name"],
        maxLength:[30,"que no exeda los 30 caracteres"],
        minLength:[4,"el minimo de caracteres es 4"]
    },
    email:{
        type:String,
        required:[true,"please enter you email"],
        unique:true,
        validate:[validator.isEmail,"please enter valid email"]

    },
    password:{
        type:String,
        required:[true,"please enter you password"],
        minLength:[8,"password should be greater than 8 characters"],
        select:false
    },
    avatar:{
        
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        
    },
    role:{
        type: String,
        default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next()
    }

    this.password = await bcrypt.hash(this.password,10)

})

// jwt token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({ id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
};

//compare Password

userSchema.methods.comparePassword = async function(enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password)

}

// generating password reset token

userSchema.methods.getResetPasswordToken = function(){
    //generating token

    const resetToken = crypto.randomBytes(20).toString("hex")

    // hashing and add to userschema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;

}

module.exports = mongoose.model("User",userSchema);