const express = require("express");
const router = express.Router();
const Blog = require("../../model/Blog/blog.model");
const authenticate = require("../../middlewares/Authentication/authenticate");
const { populate } = require("../../model/comment.model");

//  all blogs get route with pagintion and populate author
router.get("", async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Extract the page number from the query parameters
    const limit =parseInt(req.query.limit) || 10; // Set the number of blogs to retrieve per page
    try {
      const count = await Blog.countDocuments(); // Get the total count of blogs
      const totalPages = Math.ceil(count / limit); // Calculate the total number of pages
  
      const skip = (page - 1) * limit; // Calculate the number of blogs to skip
  
      const blogs = await Blog.find({},'-viewcount')
        .populate({ path: "author", select: ["fullName","email"] }).
        populate({
          path: "comments",
          select: ["content"],
          populate: {
            path: "author",
            select: ["fullName", "email"]
          }
        })
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

  // *? get all blogs by user 
  router.get("/author/:userId", async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Extract the page number from the query parameters
    const limit = parseInt(req.query.limit) || 10; // Set the number of blogs to retrieve per page
    const userId = req.params.userId; // Extract the user ID from the request parameters
  
    try {
      const count = await Blog.countDocuments({ author: userId }); // Get the total count of blogs by the user ID
      const totalPages = Math.ceil(count / limit); // Calculate the total number of pages
  
      const skip = (page - 1) * limit; // Calculate the number of blogs to skip
  
      const blogs = await Blog.find({ author: userId })
        .populate({ path: "author", select: ["fullName", "email"] })
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

// *? create single blog post
router.post("/create",authenticate, async (req, res) => {
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

// get single blog by id

router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate({ path: "author", select: ["fullName","email"] }).lean().exec();
        if (!blog) {
            return res.status(404).send({ message: "Blog not found" });
        }
        return res.status(200).send(blog);
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
});




// get single blog by userid and blogid

// Import the authentication middleware

// Apply the authentication middleware to the route
router.get("/users/:userId/blogs/:blogId", authenticate, async (req, res) => {
  try {
    const userId = req.params.userId; // Extract the user ID from the URL
    const blogId = req.params.blogId; // Extract the blog ID from the URL

    const blog = await Blog.findOne({ _id: blogId, author: userId })
      .populate({ path: "author", select: ["fullName", "email"] })
      .lean()
      .exec();
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }
    return res.status(200).send(blog);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
});


router.patch("/edit/:blogId", authenticate, async (req, res) => {
  try {
    const userId = req.user._id; // Extract the user ID from the authenticated user object

    const blogId = req.params.blogId; // Extract the blog ID from the URL

    const blog = await Blog.findOneAndUpdate({ _id: blogId, author: userId },req.body, { new: true })
      .populate({ path: "author", select: ["fullName", "email"] })
      .lean()
      .exec();

    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    return res.status(200).send(blog);
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
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
