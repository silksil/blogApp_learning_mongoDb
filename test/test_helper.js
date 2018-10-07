const mongoose = require('mongoose');

/*
 Mongoose has its own promise library, which can show an error
 Here you state you use the ES6 library for promises
*/
mongoose.Promise = global.Promise

// State that you connect to mongo one time before all tests run
before((done) => {
  /*
  Here we specify where make the connection
  This says, on my local machine => find this
  If it remote, you would replace the localhost for a port
  The last part refers to the instance/db you have to connect to
  */
  mongoose.connect('mongodb://localhost/user_test');

  /*
    'once' and 'on' are event handler
    If you find an event called 'open' we are good to go
    If you find an event called 'on' we failed to connect
  */
  mongoose.connection
    // done() states: move one to first test, once you are connected
    .once('open', () => { done(); })
    .on('error', (error) => {
      console.warn('Warning', error);
    });
});

  /*
    We drop the db everytime we run a test
    We do this so that individual test are not impacted by each other
    Through 'drop' we take all records and delete it
  */

  beforeEach((done) => {
  const { users, comments, blogposts } = mongoose.connection.collections;
  /*
    We have to drop every collection seperaretly to make sure we have a fresh start for every test
    We include callack to make sure we don't skip to the next test untill we have finished the other test and dropped the included data
  */
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});
