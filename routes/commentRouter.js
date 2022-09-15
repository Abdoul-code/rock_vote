const express = require("express")
const commentRouter = express.Router()
const Comment = require('../models/comment.js')

// Get comment by user id
commentRouter.get("/:issueId/comments", (req,res,next) => {
    Comment.find({issue:req.params.issueId}, (err,comments)=>{
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(comments)
    })
})

//get all the comment
commentRouter.get("/", (req,res,next)=>{
    Comment.find((err,comments)=>{
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(comments)
    })
})

//add new comment
commentRouter.post("/:issueId/comments", (req,res,next) =>{
    req.body.user = req.auth._id
    let issueId = req.params.issueId
    req.body.issue = issueId
    const newComment = new Comment(req.body)
    newComment.save((err, savedComment) => {
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(201).send(savedComment)
    })
})

//Delete comment
commentRouter.delete("/:issueId/comments/:commentId" ,(req,res,next) =>{
    console.log("comment router hit: ", req.params, )
    Comment.findOneAndRemove(
        {_id:req.params.commentId, user:req.auth._id},
        (err, deletedComment) =>{
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(`Successfully delete comment:${deletedComment.title}`)
        }
    )
})

//update comment
commentRouter.put("/:commentId", (req,res,next) =>{
    Comment.findByIdAndUpdate(
        {_id: req.params.issueId, user:req.auth._id},
        req.body,
        {new:true},
        (err, updatedComment) =>{
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(updatedComment)
        }
    )
})
module.exports = commentRouter


