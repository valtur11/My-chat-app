const expect = require('chai').expect;
const createAuthMethods = require('../../Authentication/controller');
const sinon = require('sinon');
const expectedUserDetails = { email: 'tester@test.com'};
const token = 'header.payload.signature';

describe('Authentication', function() {
  describe('Create jwt token', function() {
    const sign = sinon.fake.returns(token);
    const JWT_SECRET = 'This is a JWT secret for mocha testing';
    const options = {expiresIn: '2h'};
    const { createToken } = createAuthMethods({
      jwt: { sign },
      env: { JWT_SECRET }
    });
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
      // check args
      expect(userDetailsAndToken).to.be.an('object').that.include({ ...expectedUserDetails, token });
    });
  });
  // sign in component shows when only the user is not authorized
  //password length
  //rate limiter
  //isMatch is always true check test
  describe('Sign up', function () {
    it('should return status 200 with user details and token', /*function () {
      // const expectStatus = 200;
      // singup service
    }*/);

    it('should return 400 when email or username is taken');
  });
  describe('Sign in', function () {
    it('should return 400 when email or username is incorrect');
  });
});