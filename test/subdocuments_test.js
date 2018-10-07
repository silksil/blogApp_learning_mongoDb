const assert = require('assert');
const User = require('../src/user');

describe('Subdocuments', () => {
  it('can create a subdocument', (done) => {
    const joe = new User({
      name: 'Joe',
      /*
        We create a subdocument by nesting properties
        Mongoose will then check the properties (e.g. is it a string?)
      */
      posts: [{ title: 'PostTitle' }]
    });

    joe.save()
      .then(() => User.findOne({ name: 'Joe' }))
      .then((user) => {
        // We check whether the subdocument succesfully added
        assert(user.posts[0].title === 'PostTitle');
        done();
      });
  });
  it('Can add subdocuments to an existing record', (done) => {
    // create Joe
    const joe = new User({
      name: 'Joe',
      posts: []
    });

    // save Joe
    joe.save()
      // fetch Joe
      .then(() => User.findOne({ name: 'Joe' }))
      .then((user) => {
        /*
          Add a post to Joe
          Posts is a array, we can push an element to the array
        */
        user.posts.push({ title: 'New Post' });
        // save Joe
        return user.save();
      })
      // fetch Joe
      .then(() => User.findOne({ name: 'Joe' }))
      .then((user) => {
        // make assertion
        assert(user.posts[0].title === 'New Post');
        done();
      });
    });
    it('can remove an existing subdocument', (done) => {
      const joe = new User({
        name: 'Joe',
        posts: [{ title: 'New Title' }]
      });

      joe.save()
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
          /*
            This is not just plain javascript but functionality by mongoose
            We get the post we want to remove
            Then .remove() can be called
          */
          const post = user.posts[0];
          post.remove();
          /*
            When we remove a document we can just call .remove
            If we remove subdocuments we have to call the parent record with .save
          */
          return user.save();
        })
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
          assert(user.posts.length === 0);
          done();
        });
    });
});
