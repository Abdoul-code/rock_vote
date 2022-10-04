const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.js")

userRouter.get("/", (req,res,next) =>{
    User.find((err, Users) =>{
        if(err){
            res.status(500);
            return next(err);
        }
        return res.send(Users);
    });
});

module.exports = userRouter;