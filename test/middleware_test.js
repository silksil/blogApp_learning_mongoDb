const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');

describe('Middlware', () => {
  let joe, blogPost;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is' });

    /*
      Has a collection of blogPost and I want to associate a blogpost
      We push in an entire models
      Mongo sees that you push an entire model and simply assigns an objectId
    */
    joe.blogPosts.push(blogPost);

    Promise.all([joe.save(), blogPost.save()])
      .then(() => done());
  });

  it('users clean up dangling blogposts on remove', (done) => {
    joe.remove()
      /*
        as we have created one blogPost, we test it by counting
        we do this by getting the model and add the function .count
      */
      .then(() => BlogPost.count())
      // we pass the counted blog posts
      .then((count) => {
        assert(count === 0);
        done();
      });
  });
});
