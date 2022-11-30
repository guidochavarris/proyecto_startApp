
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product Name"]
    },
    description:{
        type:String,
        required:[true,"please enter product description"]
    },
    price:{
        type:Number,
        default:0

    },

    images:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    category:{
        type:String,
        required:[true, "please ingrese la categoria"],
        
    },
    Stock:{
        type:Number,
        required:[true, "please enter product estock"],
        maxLength:[4,"stock 4 carcteres"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0

    },
    reviews:[
        {
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true
            },

            comment:{
                type:String,
                required:true
            }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required: true,
    },

    createdAt:{
        type:Date,
        default:Date.now
    }    
    
})

module.exports = mongoose.model("Product",productSchema);