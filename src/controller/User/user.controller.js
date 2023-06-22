const router= require("express").Router();
const User= require("../../model/User/user.model");

//!get request to get all the users
router.get("/",async(req,res)=>{
    try {
        const users= await User.find().lean().exec();
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
})




//import router 
module.exports=router