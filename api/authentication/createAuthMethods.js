const debug = require('debug')('createAuthMethods');
/**
 * Function returning all authentication services
 * @param {*} lib all dependecies (Dependecy injection)
 * @todo when there is already a valid token, it should return error. 409?
 */
const createAuthMethods = (lib) => {
  /**
     * Helper function that creates new token that returns the payload argument and the token. should be private and immutable.
     * @param {Object} payload user details
     * @todo the payload argument to be without the password
     */
  function createToken (payload) {
    const options = { expiresIn: '2h' };
    const token = lib.jwt.sign(payload, lib.env.JWT_SECRET, options);
    return { ...payload, token };
  }

  return {
    createToken,
    /**
     * Signup service
     * @param {*} userDetails
     */
    async signup(userDetails) {
      try {
        const User = await lib.user.create(userDetails);
        const UserAndToken = createToken({ email: User.email, userId: User._id });
        return { data: {...UserAndToken}, status: 201 };
      } catch (error) {
        const message = error.message || 'Oops! Unexpected error.';
        if(error.code === 11000) {
          const message = 'This account is taken. You can Signup with another email.';
          return { status: 400, message };
        } else {
          return { status: 500, message };
        }
      }
    },
    /**
     * Login service.
     * @todo support user in addition to email to find the user
     * @param {string} email
     * @param {string} candidatePassword
     */
    async login(email, candidatePassword) {
      try {
        const user = await lib.user.findOne({ email });
        debug('isMatch is being called');
        const isMatch = await user.comparePassword(candidatePassword);
        if(isMatch){
          const UserAndToken = createToken({email: user.email, userId: user._id});
          return { data: { ...UserAndToken }, status: 200 };
        } else {
          throw { status: 400, message: 'Invalid email or password.' };
        }
      } catch (error) {
        const message = error.message || 'Oops! Unexpected error.';
        if(error.status === 400){
          //throw error
          return {...error, message};
        } else {
          return { message , status: 500 };
        }
      }
    },
    verifyToken(token) {
      try {
        const decoded = lib.jwt.verify(token, lib.env.JWT_SECRET);
        debug(decoded);
        if (decoded) {
          return decoded;
        } else {
          throw new Error();
        }
      } catch (e) {
        const error = new Error('Please Log In First');
        error.status = 401;
        throw error;
      }
    }
  };
};

module.exports = createAuthMethods;
