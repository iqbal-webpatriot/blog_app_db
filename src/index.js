const express= require("express");
const connect= require("./configs/db");
const  cors= require("cors");
const path=require('path')
const app= express();
const port=process.env.PORT || 4568;

//!global middlewares 
app.use(cors());
app.use(express.json())
app.use("/blogs",blogController)



//!listen to the server 
app.listen( port  , async()=>{
    try {
          await connect()
          console.log(`listening port number ${port}   `)
    } catch (error) {
        console.log("Error while connecting to database" , error.message)
    }
})