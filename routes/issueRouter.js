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

// Get todos by user id
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
    { _id: req.params.issueId, user: req.auth._id },
    (err, deletedIssue) => {
      if(err){
        res.status(500)
        return next(err)
      }
      return res.status(200).send(`Successfully delete todo: ${deletedIssue.title}`)
    }
  )
})

// Update Issues
issueRouter.put("/:issueId", (req, res, next) => {
  Issue.findOneAndUpdate(
    { _id: req.params.issueId, user: req.auth._id },
    req.body,
    { new: true },
    (err, updatedIssue) => {
      if(err){
        res.status(500)
        return next(err)
      }
      return res.status(201).send(updatedIssue)
    }
  )
})

//upvote
// issueRouter.put("/upvote/:issueId", (req, res, next) => {
//   console.log(typeof req.auth._id)
//   Issue.findById(
//     req.params.issueId,
//     (err,upvotedIssue) =>{
//       if(err){
//         res.status(500)
//         return next(err)
//       }
//       const hasUpvoted = updatedIssue.upvotes.includes(req.auth._id)
//       if(hasUpvoted) {
//         return res.status(200).send(`The user has already voted`)
//       } else {
//         Issue.findOneAndUpdate(req.params.issueId, {$push :{upvotes:req.auth._id}}, {new:true},
//           (err, updatedIssue) =>{
//             if(err){
//               res.status(500)
//               return next(err)
//             }
//             return res.status(201).send(updatedIssue)
//           })
//       }
//       return res.status(201).send(updatedIssue)
//     }
//     )
// })

module.exports = issueRouter