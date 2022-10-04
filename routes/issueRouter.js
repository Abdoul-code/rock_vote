const express = require("express")
const issueRouter = express.Router()
const Issue = require('../models/issues.js')

// Get All Issues
issueRouter.get("/", (req, res, next) => {
  Issue.find((err, issue) => {
    if(err){
      res.status(500)
      return next(err)
    }
    return res.status(200).send(issue)
  })
})

// Get issue by user id
issueRouter.get("/user", (req, res, next) => {
  Issue.find({ user: req.auth._id }, (err, issue) => {
    if(err){
      res.status(500)
      return next(err)
    }
    return res.status(200).send(issue)
  })
})

// Add new Issues
issueRouter.post("/", (req, res, next) => {
  req.body.user = req.auth._id
  const newIssue = new Issue(req.body)
  newIssue.save((err, savedIssue) => {
    if(err){
      res.status(500)
      return next(err)
    }
    return res.status(201).send(savedIssue)
  })
})

// Delete Issues
issueRouter.delete("/:issueId", (req, res, next) => {
  Issue.findOneAndDelete(
    { _id: req.params.issueId, user: req.auth._id},
    (err, deletedIssue) => {
      if(err){
        res.status(500)
        return next(err)
      }
      return res.status(200).send(`Successfully delete Issue: ${deletedIssue.title}`)
    }
  )
})



//Issue comment 
issueRouter.put("/addComment/:issueId", (req, res,next) =>{
  Issue.findOneAndUpdate(
    {_id:req.params.issueId},{$push:{
    //may need user name
    comment:req.body.comment
  }},{new:true},
  (err,issue) =>{
    if(err){
      res.status(500)
      return next(err)
    }
    return res.status(200).send(issue)
  }
)
})


// Update Issues
issueRouter.put("/upvote/:issueId", (req, res, next) => {
  Issue.findOneAndUpdate(
    { _id: req.params.issueId, user: req.auth._id },
    {$addToSet: {upvotes: req.auth._id}, $pull:{downvotes:req.auth._id}},
    { new: true },
    (err, updatedIssue) => {
      if(err){
        res.status(500)
        return next(err)
      }
      return  res.status(201).send(updatedIssue)
    }
  )
})

//downvote
issueRouter.put("/downvote/:issueId", (req, res, next) => {
  Issue.findByIdAndUpdate(
   { _id: req.params.issueId, user: req.auth._id },
   {$addToSet: {downvotes: req.auth._id}, $pull: {upvotes:req.auth._id}},
    { new: true },
    (err,updatedIssue) =>{
      if(err){
        res.status(500)
        return next(err)
      }
      return res.status(200).send(updatedIssue)
    }
  )
})

issueRouter.put("/:issueId", (req, res, next) =>{
      Issue.findOneAndUpdate(
        {_id:req.params.issueId, user:req.auth._id},
        req.body,
         {new:true},
            (err, updatedIssue) =>{
              if(err){
                res.status(500)
                return next(err)
              }
              return res.status(201).send(updatedIssue)
           })
})


module.exports = issueRouter