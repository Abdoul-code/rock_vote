const express = require("express")
const commentRouter = express.Router()
const Comment = require('../models/comment.js')

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

// Get comment by issue Id
commentRouter.get("/:issueId/comments", (req,res,next) => {
    Comment.find({issue:req.params.issueId}, (err,comments)=>{
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(comments)
    })
})


//add comment to issue by issueId
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

//find a comment by Id
commentRouter.get("/:commentId", (req ,res, next) =>{
    Comment.findById(req.params.commentId, (err, comment) =>{
        if(err){
            res.status(500);
            return next(err)
        } else if (!comment) {
            res.status(404)
            return next(new Error("no comment found."))
        }
        return res.send(comment);
    })
})

//Delete comment by Id
commentRouter.delete("/:issueId/comments/:commentId" ,(req,res,next) =>{
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
        {_id: req.params.commentId, user:req.auth._id},
        req.body,
        {new:true},
        (err, comment) =>{
            if(err){
                console.log("Error")
                res.status(500)
                return next(err)
            }
            return res.status(201).send(comment)
        }
    )
})
module.exports = commentRouter


