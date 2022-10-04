const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    comment :{
        type:String,
        lowercase: true,  
    },
    issue: {
        type: Schema.Types.ObjectId, 
        ref: 'Issues', 
        require: true
    }, 
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      
      datePosted:{
        type:Date,
        default:Date.now
      }
})

module.exports = mongoose.model("Comment", commentSchema)

