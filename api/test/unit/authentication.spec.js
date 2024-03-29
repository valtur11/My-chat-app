/**
 * Authentication feature's spec file
 * @todo sign in component shows when only the user is not authorized
 * @todo password length limit
 * @todo rate limiter
  * @todo isMatch is always true check test
 */
const expect = require('chai').expect;
const createAuthMethods = require('../../authentication/createAuthMethods');
const sinon = require('sinon');
const expectedUserDetails = { email: 'tester@test.com', password: 'test'};
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
        expect(sign.lastCall.args[2]).to.deep.equal({...options });
      });
    });

    it('should return the user details and token', function () {
      expect(userDetailsAndToken).to.be.an('object').that.include({ ...expectedUserDetails, token });
    });
  });

  describe('Sign up', function () {
    const takenUserDetails = { email: 'taken@taken.com' };
    const takenError = new Error('Sorry, but this email or username is taken.');
    takenError.code = 11000;
    const serverError = new Error('Server failure.');
    serverError.code = 'This is unexpected error code';
    // singup service, independent from express
    const tests = [
      {
        description: 'should return status 201 with user details and token',
        userCreate: sinon.fake.returns(expectedUserDetails),
        args: expectedUserDetails,
        expected: [['data', {email: expectedUserDetails.email, token}], ['', {status: 201}]]
      },
      {
        description: 'should return 400 when email or username is taken',
        userCreate: sinon.fake.throws(takenError),
        args: takenUserDetails,
        expected: [['', {status: 400}]]
      },
      {
        description: 'should return 500 when unexpected error had happened',
        userCreate: sinon.fake.throws(serverError),
        args: expectedUserDetails,
        expected: [['', {status: 500}]]
      },
      {
        description: 'should await the user details before returning the user details',
        userCreate: sinon.fake.returns(new Promise((resolve, reject) => {
          const clock = sinon.useFakeTimers();
          clock.tick(0);
          (clock) ? resolve (expectedUserDetails) : reject();
        })),
        args: expectedUserDetails,
        expected: [['data', {email: expectedUserDetails.email, token}], ['', {status: 201}]]
      }
    ];

    tests.forEach((test) => {
      const { signup } = createAuthMethods({
        ...commonAuthOptions,
        user: { create: test.userCreate }
      });
      it(test.description, async () => {
        const newUser = await signup(test.args);
        test.expected.forEach((val) => {
          const actual = newUser[val[0]] || newUser;
          expect(actual).to.be.an('object').that.include(val[1]);
        });
      });
    });
  });

  describe('Log in', function () {
    const createFake = (isMatch, throwError = false) => {
      const fakeObj = {
        ...commonAuthOptions,
        user: {}
      };

      if(throwError){
        fakeObj.user = { findOne: sinon.fake.throws(new Error('Unexpected'))};
      }else {
        fakeObj.user = { findOne: sinon.fake.returns({
          ...expectedUserDetails,
          comparePassword: sinon.fake.returns(isMatch)
        })};
      }
      return createAuthMethods(fakeObj);
    };
    const email =  expectedUserDetails.email;
    const tests = [
      {
        description: 'should return 200 with user details when email and password are correct',
        isMatch: true,
        expected: [['data', {email, token}], ['status', 200]]
      },
      {
        description: 'should return 400 when email or username is incorrect',
        isMatch: false,
        expected: [['status', 400]]
      },
      {
        description: 'should return 500 when unexpected error had happened',
        throwError: true,
        expected: [['status', 500]]
      }
    ];

    tests.forEach(test => {
      it(test.description, async () => {
        const { login } = createFake(test.isMatch, test.throwError);
        const user = await login(expectedUserDetails.email, expectedUserDetails.password);
        test.expected.forEach(val => {
          const actual = user[val[0]] || user;
          expect(actual).to.deep.equal(val[1]);
        });
      });
    });
  });
});