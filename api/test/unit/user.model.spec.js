const expect = require('chai').expect;
const debug = require('debug')('My_chat_app: user model spec');
const User = require('../../models/user');

describe('User Model', () => {
  describe('email', () => {
    it('should be valid if is at the correct format', () => {
      const value = 'test@test.com';
      const user = new User();
      user.email = value;
      user.validate((error) => {
        debug('Path `email` is valid.');
        expect(error.errors.email).to.be.undefined;
      });
    });

    it('should be invalid if isn\'t at the correct format', () => {
      const value = 'test@test';
      const user = new User();
      user.email = value;
      user.validate((error) => {
        debug('Path `email` is invalid.');
        expect(error.errors.email).to.exist;
      });
    });
  });

  describe('pasword', () => {
    const tests = [
      {
        shouldBeValid: false,
        arg: { value: '0123456' },
        condition: 'less than 8 characters'
      },
      {
        shouldBeValid: true,
        //password value with length 100:
        value: '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
        condition: 'is no more than 100 characters'
      },
      {
        shouldBeValid: false,
        //password value with length 101:
        value: '10123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
        condition: 'is more than 100 characters'
      }
    ];
    tests.forEach(test => {
      const valid = (test.shouldBeValid) ? 'valid' : 'invalid';
      const description = `should be ${valid} if is ${test.condition}`;
      it(description, () => {
        const user = new User();
        user.password = test.value;
        user.validate(error => {
          if(test.shouldBeValid) {
            expect(error.errors.password).to.be.undefined;
          } else {
            expect(error.errors.password).to.exist;
          }
        });
      });
    });
  });
});
