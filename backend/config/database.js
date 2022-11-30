const mongoose = require("mongoose");

const connectDatabase =( )=>{
    mongoose.connect(process.env.DB_URI,{keepAlive:true,useNewUrlParser:true,
        useUnifiedTopology:true}).then((data)=>{
            //{useNewUrlParser:true,useUnifieldTopology:true,useCreateIndex:true}
        console.log(`Mongodb connected with server: ${data.connection.host}`);
        
        
        })   
}

module.exports = connectDatabase