const assert = require('assert');
const User = require('../src/user');

describe('Validating records', () => {
  /*
    If a username is not assigned, it's not a valid record
  */
  it('requires a user name', () => {
    // include a name that is undefined, don't save it
    const user = new User({ name: undefined });
    /*
      ValidateSync returns an object validating the user model
      If a lot of properties were wrong, it would include a lot of error messages
    */
    const validationResult = user.validateSync();
    const { message } = validationResult.errors.name;

    assert(message === 'Name is required.');
  });
  it('requires a user\'s name longer than 2 characters', () => {
    const user = new User({ name: 'Al' });
    const validationResult = user.validateSync();
    const { message } = validationResult.errors.name;

    assert(message === 'Name must be longer than 2 characters.');
  });
  it('disallows invalid records from being saved', (done) => {
    const user = new User({ name: 'Al' });
    user.save()
      .catch((validationResult) => {
        const { message } = validationResult.errors.name;

        assert(message === 'Name must be longer than 2 characters.');
        done();
      });
  });
});
