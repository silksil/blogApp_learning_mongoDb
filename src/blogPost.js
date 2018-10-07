const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: String,
  content: String,
  /*
    Refering to collections is different than referencing subdocuments
    We pass a array to comments to state we expect many different comments
    'type' points off to a different collections by including ObjectId
    'ref' to understand what type/collection the id's relate to we assign a ref
    through 'ref' we state that we create a `Comment` model
    This is similar as: `const User = mongoose.model('user', UserSchema)``
  */
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }]
});

const BlogPost = mongoose.model('blogPost', BlogPostSchema);

module.exports = BlogPost;
