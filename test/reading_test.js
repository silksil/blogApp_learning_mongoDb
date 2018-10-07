const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of the database', () => {

  // make it global, so we can access it everywhere
  let joe, maria, alex, zach;

  // First we create users to test whether we can find them
  beforeEach((done) => {
    alex = new User({ name: 'Alex' });
    joe = new User({ name: 'Joe' });
    maria = new User({ name: 'Maria' });
    zach = new User({ name: 'Zach' });

    // the sequence of saving is not guaranteed
    Promise.all([joe.save(), alex.save(), maria.save(), zach.save()])
      .then(() => done());
  });


  it('finds all users with a name of joe', (done) => {
    /*
      besides .find you can use findOne
      .findOne returns only the first user
      .find returns an array with all users

      First you define the user model / class
      You pass that defines the criterea you search for
    */
    User.find({ name: 'Joe' })
      // the callback passes all the users found
      .then((users) => {

        /*
          monogoose already assigns an id, even though it has not been saved
          Thus we take the created user (joe) and can check it's _id
          The _id isn't a raw string, but an object that wraps that string
          Thus we do .toString
        */
        assert(users[0]._id.toString() === joe.id.toString())
        done();
      });
  });
  it('find a user with a particular id', (done) => {
    User.findOne({ _id: joe._id })
      // the difference between .find is that it returns a single user
      .then((user) => {
        assert(user.name === 'Joe');
        done();
      });
  });

  it('can skip and limit the result set', (done) => {
    User.find({})
      /*
        sort it based on the property 'name'
        1 = a>z
        -1 = z>a
      */
      .sort({ name: 1 })
      .skip(1)
      .limit(2)
      .then((users) => {
        assert(users.length === 2);
        assert(users[0].name === 'Joe');
        assert(users[1].name === 'Maria');
        done();
      });
  });
});
