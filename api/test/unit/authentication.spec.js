/**
 * Authentication feature's spec file
 * @todo sign in component shows when only the user is not authorized
 * @todo password length limit
 * @todo rate limiter
  * @todo isMatch is always true check test
 */
const expect = require('chai').expect;
const createAuthMethods = require('../../authentication/controller');
const sinon = require('sinon');
const expectedUserDetails = { email: 'tester@test.com'};
const token = 'header.payload.signature';
const sign = sinon.fake.returns(token);
const JWT_SECRET = 'This is a JWT secret for mocha testing';
const options = {expiresIn: '2h'};
const commonAuthOptions = {
  jwt: { sign },
  env: { JWT_SECRET }
};

describe('Authentication', function() {
  describe('Create jwt token', function() {
    const { createToken } = createAuthMethods({ ...commonAuthOptions });
    let userDetailsAndToken;

    beforeEach(function () {
      userDetailsAndToken = createToken(expectedUserDetails);
    });

    describe('jwt sign()', function () {
      it('should call with the payload and JWT_SECRET', function () {
        expect(sign.calledWith(expectedUserDetails, JWT_SECRET)).to.be.true;
      });
      it('should expire in 2 hours', function () {
        expect(sign.lastCall.args[2]).to.deep.equal([options]);
      });
    });

    it('should return the user details and token', function () {
      expect(userDetailsAndToken).to.be.an('object').that.include({ ...expectedUserDetails, token });
    });
  });

  describe('Sign up', function () {
    it('should return status 201 with user details and token', async function () {
      const { signup } = createAuthMethods({
        ...commonAuthOptions,
        user: { create: sinon.fake.returns(expectedUserDetails)}
      });
      // singup service, independent from express
      // res.status(obj.status).json(object.userDetails);
      const status = 201;
      const newUser = await signup(expectedUserDetails);
      expect(newUser).to.be.an('object').that.include({ status });
      expect(newUser.data).to.be.an('object').that.include({ ...expectedUserDetails, token });
    });

    it('should return 400 when email or username is taken', async function () {
      const takenError = new Error('Sorry, but this email or username is taken.');
      takenError.code =  11000;
      const { signup } = createAuthMethods({
        ...commonAuthOptions,
        user: { create: sinon.fake.throws(takenError)}
      });
      const status = 400;
      const takenUserDetails = { email: 'taken@taken.com' };

      const newUser = await signup(takenUserDetails);
      expect(newUser).to.be.an('object').that.include({ status });
    });

    it('should return 500 when unexpected error had happened', async function () {
      const takenError = new Error('Server failure.');
      takenError.code =  'This is unexpected error code';
      const { signup } = createAuthMethods({
        ...commonAuthOptions,
        user: { create: sinon.fake.throws(takenError)}
      });
      const status = 500;
      const takenUserDetails = { email: 'taken@taken.com' };

      const newUser = await signup(takenUserDetails);
      expect(newUser).to.be.an('object').that.include({ status });
    });

    it('should await the user details before returning the user details', async function () {
      const status = 201;
      const { signup } = createAuthMethods({
        ...commonAuthOptions,
        user: {
          create: sinon.fake.returns(new Promise((resolve, reject) => {
            const clock = sinon.useFakeTimers();
            clock.tick(0);
            (clock) ? resolve (expectedUserDetails) : reject();
          }))
        }
      });
      const newUser = await signup(expectedUserDetails);
      expect(newUser).to.be.an('object').that.include({ status });
      expect(newUser.data).to.be.an('object').that.include({ ...expectedUserDetails, token });
    });
  });
  describe('Log in', function () {
    it('should return 400 when email or username is incorrect');
  });
});