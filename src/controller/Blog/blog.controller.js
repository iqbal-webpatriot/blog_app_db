const express = require("express");
const router = express.Router();
const Blog = require("../../model/Blog/blog.model");

//  all blogs get route with pagintion 

router.get("", async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Extract the page number from the query parameters
    const limit =parseInt(req.query.limit) ||10; // Set the number of blogs to retrieve per page
    try {
      const count = await Blog.countDocuments(); // Get the total count of blogs
      const totalPages = Math.ceil(count / limit); // Calculate the total number of pages
  
      const skip = (page - 1) * limit; // Calculate the number of blogs to skip
  
      const blogs = await Blog.find()
        .populate({ path: "author", select: ["fullName","email"] })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
  
      return res.status(200).send({
        totalPages,
        currentPage: page,
        blogs
      });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

// *? create single blog upload route
router.post("", async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      comments: req.body.comments,
      likecount: req.body.likecount,
      viewcount: req.body.viewcount,
      likestatus: req.body.likestatus,
    });
    return res.status(201).send(blog);
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
});

// Edit Single Blog Post Using blog Id
router.patch("/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) {
            return res.status(404).send({ message: "Blog not found" });
        }
        return res.status(200).send(blog);
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
});










// delete single blog by id 

router.delete("/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        return res.status(200).send(blog);
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
});

// get single blog by id

router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate({ path: "author", select: ["fullName","email"] }).lean().exec();
        if (!blog) {
            return res.status(404).send({ message: "Blog not found" });
        }
        return res.status(200).send(blog);
    } catch (error) {


        return res.status(400).send({ message: error.message });
    }

});


module.exports = router;
