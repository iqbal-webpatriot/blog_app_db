const express = require("express");
const router = express.Router();
const Comment = require("../model/comment.model");


// create single comment upload route
router.post("", async (req, res) => {
    try {
        const comment = await Comment.create({
        content: req.body.content,
        post_id: req.body.post_id,
        userId: req.body.userId,
        });
        return res.status(201).send(comment);
    } catch (error) {
        return res.status(401).send({ message: error.message });
    }
    }       
);


// *? all comments get route

router.get("", async (req, res) => {
    try {
      const comments = await Comment.find()
        .lean()
        .exec();
  
      return res.status(200).send(comments);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });


module.exports = router;
  