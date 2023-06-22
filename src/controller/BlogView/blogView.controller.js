const router=require("express").Router();
const View=require("../../model/BlogView/blogView.model");
const Blog=require("../../model/blog.model");
const ip= require("ip");
//! get all viewed blogs result
router.get("",async(req,res)=>{
    try {
        const view=await View.find().lean().exec();
        return res.status(200).send(view);
    } catch (error) {
        return res.status(400).send({message:error.message});
    }
})
//!create new view entry when user view a blog
router.post("",async(req,res)=>{
    try {
        //! current ip address
        const currentIp= ip.address();
        console.log("cuurent ip address ",currentIp);
        //!check if ip address and blog id already exist
        const alreadyViewed=await View.findOne({ipAddress:currentIp,blogId:req.body.blogId}).lean().exec();
        //!if already exist then return message
        if(alreadyViewed){
            return res.status(400).send({message:"Updated blog view count "});
        }
        //!else create new view entry
        const view=await View.create({
            blogId:req.body.blogId,
            ipAddress:currentIp
        });
        const updatedViewCount= await Blog.findByIdAndUpdate(req.body.blogId,{$inc:{viewcount:1}},{new:true}).lean().exec();
        //!return view entry
        return res.status(201).send({message:"Updated blog view count ",updatedViewCount});
    } catch (error) {
        return res.status(400).send({message:error.message});
    }
})
//!export router
module.exports=router;