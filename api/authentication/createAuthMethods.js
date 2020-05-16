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
        const UserAndToken = createToken({ email: User.email });
        return { data: {...UserAndToken}, status: 201 };
      } catch (error) {
        const msg = error.message;
        if(error.code === 11000) {
          return { status: 400, msg };
        } else {
          return { status: 500, msg };
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
        const isMatch = await user.comparePassword(candidatePassword);
        if(isMatch){
          const UserAndToken = createToken({email: user.email});
          return { data: { ...UserAndToken }, status: 200 };
        } else {
          throw { status: 400 };
        }
      } catch (error) {
        const msg = error.message;
        if(error.status === 400){
          //throw error
          return error;
        } else {
          return { msg , status: 500 };
        }
      }
    }
  };
};

module.exports = createAuthMethods;
