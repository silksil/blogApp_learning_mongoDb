const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: String,

  //We only have a singel user associated with a comment, so we assign a object
  user: { type: Schema.Types.ObjectId, ref: 'user' }
});

// model has have to have the same name as in blogPost
const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
