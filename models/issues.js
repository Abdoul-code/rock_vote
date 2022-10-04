const mongoose = require('mongoose')
const Schema = mongoose.Schema

const issueSchema = new Schema({
  title: {
    type: String,
    required:true
  },
  description: {
    type: String
  },
  imgUrl: {
    type: String
  },
  upvotes:[{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  downvotes:[{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  datePosted:{
    type:Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Issues", issueSchema)