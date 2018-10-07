const mongoose = require('mongoose');
const PostSchema = require('./post_schema');
// Needs to be required to create a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    /*
      Here we validate the passed proprety
      We check if it has more than 2 characters
      True = valid. False = invalid
    */
    validate: {
      validator: (name) => name.length > 2 ,
      message: 'Name must be longer than 2 characters.'
    },
    /*
      Here you define that this property is required
      Include a clear error message as the second list item
    */
    required: [true, 'Name is required.']
  },
  posts: [PostSchema],
  likes: Number,
  blogPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'blogPost'
  }]
});

/*
  Create a virtual property, has to be done outside the Schema
  Virtual properties work through `get` and `set` features of ES6
  Through .get we can run a funciton assigned to property and return a value
  What is returned is the value assigned to the property

*/
UserSchema.virtual('postCount').get(function() {
  /*
    this refers to the instance of the model we are working on
    If we would use a fat arrow function, the `this` would refer to the whole file
    So, use a normal function
  */
  return this.posts.length;
});

/*
  Make sure not to use a a fat arrow function as we have to refer to the instance through `this`
  Here we state, before removing the user do this:
*/
UserSchema.pre('remove', function(next) {
  // require the collections that includes the assocation that has to be removed
  const BlogPost = mongoose.model('blogPost');

  /*
    blogPosts is an array of id's
    this refers to the instance of the user Joe
    the $in operating says go through all the records of the blogPosts collections
    If the _id's are "in" this.blogPosts => delete it
  */
  BlogPost.remove({ _id: { $in: this.blogPosts } })
    /*
      This middleware is an asyncronous function
      We don't continue with the `next` middleware untill this is completed
    */
    .then(() => next());
});


// Here you create your user model, including the schema.
// It will create a user model if doesn't exist yet.
const User = mongoose.model('user', UserSchema)

// Now you can require the User model and make a reference to a user (CRUD)
module.exports = User;
