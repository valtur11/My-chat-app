const expect = require('chai').expect;
const {signup} = require('../../Authentication/controller');
describe('Authentication', function(){
  // sign in component shows when only the user is not authorized
  describe('Sign up', function() {
    it('it should return jwt token when successfull', function () {
      const token = 'jwt.token';
      const response = signup(token);
      expect(response).to.be.an('object').that.has.property('token', token);
    });
    it('should return 400 when email or username is taken');
  });
});