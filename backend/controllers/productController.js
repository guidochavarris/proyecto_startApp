const { privateDecrypt } = require("crypto");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");





//create product -- Adamin

exports.createProduct = catchAsyncErrors(async (req,res,next) =>{

    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product 
    });
});
//get all product
exports.getAllProducts = catchAsyncErrors(async(req, res) =>{


    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter().pagination(resultPerPage)

    const products = await apiFeature.query;




    res.status(200).json({
        success:true,
        products
    });
}); 

// get product details

exports.getProductDetails = catchAsyncErrors( async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("product not fount",404));
    }

    res.status(200).json({
        success:true,
        product,
        productCount
    });

});

//update product --admin

exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{
    let product = Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("product not fount",404));
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    });
});

//delete pruduct

exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("product not fount",404));
    }

    await product.remove();

    res.status(200).json({
        success:true,
        message:"product delete sucessfill"
    });
});