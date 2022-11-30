const ErrorHander = require("../utils/errorhander");

module.exports = (err,req, res,  next) =>{
    err.statusCode = err. statusCode || 500;
    err.message = err.message || "Internal serve error";

    // Wrong Mongodb Id error

    if(err.name === "CastError"){
        const message = `Resouce not fount. invalid: ${err.path}`;
        err = new ErrorHander(message, 400)
    }

    //mongose duplicate key error

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHander(message, 400)
        
    }


    // Wrong jwt error

    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid try again`;
        err = new ErrorHander(message, 400)
    }

    // JWT EXPIRE ERROR

    if(err.name === "TokenExpiredError"){
        const message = `Json web token is expired try again`;
        err = new ErrorHander(message, 400)
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}