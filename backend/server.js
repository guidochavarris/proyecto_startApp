const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database")


//handling uncaught exception

process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the serve due to uncaughtException`)
    process.exit(1)
})



// config

dotenv.config({path:"backend/config/config.env"});

//coneccion de la base de datos ;)

connectDatabase()

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http:localhost:${process.env.PORT}`)
});



// unhandled promise rejection

process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the serve due to Undhandled Promise Rejection`)
    server.close(()=>{
        process.exit(1);
    })
})
