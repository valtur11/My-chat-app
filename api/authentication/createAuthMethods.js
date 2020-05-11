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
    const token = lib.jwt.sign(payload, lib.env.JWT_SECRET, [options]);
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
        const UserAndToken = createToken(User);
        return { data: {...UserAndToken}, status: 201 };
      } catch (error) {
        if(error.code === 11000) {
          return { status: 400 };
        } else {
          return { status: 500 };
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
        const user = lib.user.find({ email })[0];
        const isMatch = user.comparePassword(candidatePassword);
        if(isMatch){
          const UserAndToken = createToken(user);
          return { data: { ...UserAndToken }, status: 200 };
        } else {
          throw { status: 400 };
        }
      } catch (error) {
        if(error.status === 400){
          return error;
        } else {
          return { status: 500 };
        }
      }
    }
  };
};

module.exports = createAuthMethods;
