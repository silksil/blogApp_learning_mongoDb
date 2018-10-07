const mongoose = require('mongoose');
const assert = require('assert');
// upercase if it refers to a class
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Assocations', () => {
  // lowercase if it refers to an instance
  let joe, blogPost, comment;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is' });
    comment = new Comment({ content: 'Congrats on great post' });

    /*
      Has a collection of blogPost and I want to associate a blogpost
      We push in an entire models
      Mongo sees that you push an entire model and simply assigns an objectId
    */
    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);

    /*
      This is a hasOne relationship, thus we don't push
      Mongo sees that it is an reference and assigns a objectid
    */
    comment.user = joe;

    // make sure that all three are saved, before calling done()
    Promise.all([joe.save(), blogPost.save(), comment.save()])
      .then(() => done());
  });

  it('saves a relation between a user and a blogpost', (done) => {
    User.findOne({ name: 'Joe' })
      /*
        if we would now onsole.log Joe, we would only have a blogPost _id
        A query only gets executed if we include .then (alternatively the less modern.exec)
        But, this query is not finding all the data
        We can add a 'modifier' to customize the query => make it more specific or broad
        .populate is a modifier in which you add a relationship to the query (in this case blog posts)
        The comments are now NOT automatically included, you have to state this specifically
      */
      .populate('blogPosts')
      .then((user) => {
        assert(user.blogPosts[0].title === 'JS is Great');
        done();
      });
  });

  it('saves a full relation three/graph', (done) => {
    User.findOne({ name: 'Joe' })
      .populate({
        // path says, inside the object, find these assocations
        path: 'blogPosts',
        // populates says: inside the assocation
        populate: {
          // inside association 'blogPosts' find assocation 'comments'
          path: 'comments',

          // if you load up nested assocations you have to include the model
          model: 'comment',

          // inside association 'comments' find assocation 'user'
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then((user) => {
        assert(user.name === 'Joe');
        assert(user.blogPosts[0].title === 'JS is Great');
        assert(user.blogPosts[0].comments[0].content === 'Congrats on great post');
        assert(user.blogPosts[0].comments[0].user.name === 'Joe');

        done();
      });
    });
});
