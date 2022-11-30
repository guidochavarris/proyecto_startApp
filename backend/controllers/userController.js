
const ErrorHander = require("../utils/errorhander");
const User = require("../models/userModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")



//register a user

exports.registerUser = catchAsyncErrors( async(req,res,next)=>{
    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id: "this is a sample id",
            url: "profilepicUrl",
        },
    });

    sendToken(user, 201, res);
});

//login user
exports.loginUser = catchAsyncErrors (async (req,res,next)=>{
    const {email,password} = req.body;

    //chequin if usuario 

    if(!email || !password){
        return next(new ErrorHander("please enter email  y password", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if(!user){
        return next(new ErrorHander("invalid email or password"));
         
    }

    const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("invalid email or password"),401);
         
    }

    sendToken(user,200,res);


})

//logout user

exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
         
    })

    res.status(200).json({
        success: true,
        message: "Logged Out",
    })
});


//forgout password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({ email: req.body.email});

    if(!user){
        return next(new ErrorHander("User not fount", 404))
    }

    // Get reset password token

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave:false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}` 

    const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it`

    try {

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,

        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} success full`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false})
        return next(new ErrorHander(error.message, 500))
        
    }
})


// reset password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

    //creating token hash

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt: Date.now() },
    });

    if(!user){
        return next(new ErrorHander("reset password token is invalid has been expired", 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHander("password does not password", 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);
    


})